#!/usr/bin/env python3

import sys
import os
import json
from subprocess import Popen, PIPE, run

custom_page_map = { 
        "README.md" : "index.html",
        "ABOUT.md": "about.html",
        "INSTALL.md": "install.html",
        "LICENSE": "license.html",
        "DEVELOPERS.md": "developers.html",
        "CONTRIBUTING.md": "contributing.html",
        "CODE_OF_CONDUCT.md": "code-of-conduct.html",
        "CHANGES.md": "changes.html"
}

# NOTE: Fragments get ignored when converting to HTML
md_fragments = [
    "SETUP-NOTES.md",
    "TODO.md",
    "nav.md"
]

#
# mkpage wrapes the mkpage command from mkpage
# @param output_filename is the output file
# @param templates is an array of Go style templates
# @data is a dict structure that will be passed into mkpage as JSON
#
def mkpage(output_filename, templates = [], data = []):
    cmd = ['mkpage', '-o', output_filename]
    for item in data:
        cmd.append(item)
    for tmpl in templates:
        cmd.append(tmpl)
    with Popen(cmd, stdout = PIPE, stderr = PIPE) as proc:
        err = proc.stderr.read().strip().decode('utf-8')
        if err != '':
            print(f"{' '.join(cmd[0:3])} error: {err}")
            return err
        out = proc.stdout.read().strip().decode('utf-8')
        if out != "":
            print(f"{out}");
    return ""

#
# frontmatter extracts front matter from a Markdown document
# returning the results as a python dictionary. Currently
# supports only JSON style front matter.
#
# @param input_filename is the Markdown file containing front matter
# @return a Python dict of the front matter found or an empty dict
# if none found.
#
def frontmatter(input_filename):
    cmd = ['frontmatter', '-json', '-i', input_filename]
    src = ''
    with Popen(cmd, stdout = PIPE, stderr = PIPE) as proc:
        err = proc.stderr.read().strip().decode('utf-8')
        if err != '':
            print(f"{' '.join(cmd[0:3])} error: {err}")
        out = proc.stdout.read().strip().decode('utf-8')
        if (out.startswith("{") and out.endswith("}")) or (out.startswith("[") and out.endswith("]")):
            try:
                result = json.loads(out.encode('utf-8'))
            except Exception as e:
                print(f"Warning {input_filename} has invalid metadata")
                sys.exit(1)
            return result
        elif out != "":
            print(f"WARNING: Front matter isn't JSON for {input_filename}, {out}")
    return {}

#
# mkpage_version_no shows the version number of mkpage cli referenced.
#
# @param cli_name either mkpage or frontmatter
# @return version number found or system exit with error
#
def mkpage_version_no(cli_name):
    cmd = [cli_name, '-version']
    p = Popen(cmd, stdout = PIPE, stderr = PIPE)
    (version, err) = p.communicate()
    if err.decode('utf-8') != '':
        print(f"ERROR: {cli_name} -version, {err.decode('utf-8')}")
        sys.exit(1)
    return version.decode('utf-8')


#
# main - build our site based on the Markdown docs we find.
# @params args is the command line arguments, currently not used.
#
def main(args):
    app_name = args[0]
    args = args[1:]
    base_url = ""
    if len(args) > 0:
        base_url = args[0]
    # Make sure we have a page.tmpl, if not generate one
    if not os.path.exists("page.tmpl"):
        page = '''{{- define "page.tmpl" -}}
<!DOCTYPE html>
<html>
    <head>
{{- with .title -}}
        <title>{{- . -}}</title>
{{- end }}
{{- with .csspath -}}
        <link rel="stylesheet" href="{{- . -}}" >
{{- end }}
{{- with .css -}}
        <style>
        {{ . }}
        </style>
{{- end }}
    </head>
    <body>
{{- with .header -}}
       <header>{{- . -}}</header>
{{- end }}
{{- with .content }}
       <section class="content">
       {{ . }}
       </section>
{{- end }}
{{- with .footer -}}
       <footer>{{- . -}}</footer>
{{- end }}
    </body>
</html>
{{- end }}'''
        with open("page.tmpl", "w") as f:
            f.write(page)

    # Find the .md files and render them with template unless nav.md.
    # crawl docs_dir and ingest files into data collection.
    for path, folders, files in os.walk("."):
        for filename in files:
            in_name = ""
            out_name = ""
            nav_name = os.path.join(path, "nav.md")
            copyright_name = os.path.join(path, "copyright.md")
            if filename in custom_page_map:
                in_name = os.path.join(path, filename)
                out_name = os.path.join(path, custom_page_map[filename])
            elif os.path.basename(filename) in md_fragments:
                in_name = ""
                out_name = ""
            elif filename.endswith(".md") or filename.endswith(".mmark"): 
                basename, ext = os.path.splitext(filename)
                in_name = os.path.join(path, filename)
                out_name = os.path.join(path, basename + ".html")
            elif filename.endswith("fountain"):
                basename, ext = os.path.splitext(filename)
                in_name = os.path.join(path, filename)
                out_name = os.path.join(path, basename + ".html")
            if in_name != "" and out_name != "":
                print(f"Ingesting {in_name}")
                metadata = json.dumps(frontmatter(in_name))
                #NOTE: Processing metadata should happen here.
                page_data = []
                if base_url != "":
                    page_data.append(f"baseURL=text:{base_url}")
                if len(metadata):
                    page_data.append(f"front_matter=json:{metadata}")
                if os.path.exists(nav_name):
                    page_data.append(f"nav={nav_name}")
                if os.path.exists(copyright_name):
                    page_data.append(f"copyright={copyright_name}")
                if in_name.endswith("LICENSE"):
                    with open(in_name) as f:
                        src = f.read()
                        page_data.append(f"content=markdown:{src}")
                else:
                    page_data.append(f"content={in_name}")
                err = mkpage(out_name, [ "page.tmpl" ], page_data)
                if err != "":
                    print(f"Failed {in_name} -> {out_name}, {err}");
                    sys.exit(1)
                else:
                    print(f"Wrote {out_name}")
    
    # Write out message showing version of mkpage, frontmatter
    # and dataset used.
    print("Built using", end = " ")
    for i, app_name in enumerate([ "mkpage", "frontmatter", "dataset" ]):
        version = mkpage_version_no(app_name).strip()
        if i == 2:
            print(" and", end = " ")
        elif i > 0:
            print(",", end = " ")
        print(f"{version}", end = "")
    print("")
    sys.exit(0)


if __name__ == "__main__":
    main(sys.argv)
