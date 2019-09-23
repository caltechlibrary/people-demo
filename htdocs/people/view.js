(function (document, window) {
    'use strict';
    /**
     * Page data
     */
    let cl = Object.assign({}, window.CL),
        AndOr = Object.assign({}, window.AndOr),
        div = document.getElementById('example-output'),
        page_url = new URL(window.location.href),
        c_name = AndOr.getCollectionName(page_url.pathname),
        key = "",
        people = {
            "family_name": "",
            "given_name": "",
            "cl_people_id": "",
            "thesis_id": "",
            "authors_id": "",
            "archivesspace_id": "",
            "directory_id": "",
            "viaf": "",
            "lcnaf": "",
            "isni": "",
            "wikidata": "",
            "snac": "",
            "orcid": "",
            "image": "",
            "educated_at": "",
            "caltech": false,
            "jpl": false,
            "faculty": false,
            "alumn": false,
            "notes": "",
            // And/Or required fields.
            "_State": "deposit",
            "_Key": ""
        },
        default_people = Object.assign({}, people),
        form_src = `
<form class="form-people">
<div class="fields">
    <div class="required">
        <span class="inline">CL PEOPLE ID:</span>
        <span id="cl_people_id">{{cl_people_id}}</span>
    </div>
    <div>
        <span class="inline">Family Name:</span>
        <span id="family_name">{{family_name}}</span>
    </div>
    <div>
        <span class="inline">Given Name:</span>
        <span id="given_name">{{given_name}}</span>
    </div>
    <div>
        <span class="inline">Thesis ID:</span>
        <span id="thesis_id">{{thesis_id}}</span>
    </div>
    <div>
        <span class="inline">Authors ID:</span>
        <span id="authors_id">{{authors_id}}</span>
    </div>
    <div>
        <span class="inline">ArchivesSpace ID:</span>
        <span id="archivesspace_id">{{archivesspace_id}}</span>
    </div>
    <div>
        <span class="inline">Directory ID:</span>
        <span id="directory_id">{{directory_id}}</span>
    </div>
    <div>
        <span class="inline">VIAF:</span>
        <span id="viaf">{{viaf}}</span>
    </div>
    <div>
        <span class="inline">LCNAF:</span>
        <span id="lcnaf">{{lcnaf}}</span>
    </div>
    <div>
        <span class="inline">ISNI:</span>
        <span id="isni">{{isni}}</span>
    </div>
    <div>
        <span class="inline">Wikidata:</span>
        <span id="wikidata">{{wikidata}}</span>
    </div>
    <div>
        <span class="inline">SNAC:</span>
        <span id="snac">{{snac}}</span>
    </div>
    <div>
        <span class="inline">ORCID:</span>
        <span id="orcid">{{orcid}}</span>
    </div>
    <div> 
        <span class="inline">Image:</span>
        <span id="image">{{image}}</span>
    </div>
    <div>
        <span class="educated_at">Educated At:</span>
        <div id="educated_at">{{educated_at}}</div>
    </div>
    <div>
        <span class="inline">Caltech:</span>
        <span id="caltech">{{caltech}}</span>
    </div>
    <div>
        <span class="inline">JPL:</span>
        <span id="jpl">{{jpl}}</span>
    </div>
    <div>
        <span class="inline">Faculty:</span>
        <span id="faculty">{{faculty}}</span>
    </div>
    <div>
        <span class="inline">Alumn:</span>
        <span id="alumn">{{alumn}}</span>
    </div>
    <div>
        <span class="inline">Notes (internal use):</span>
        <div id="notes">{{notes}}</div>
    </div>
    <div>
        <span class="inline">Status:</span>
        <span id="_State">{{_State}}</span>
    </div>
</div><!-- END: .fields -->
<div class="controls">
    <div>
        <div id="errors" class="errors"></div>
        <div id="status" class="status"></div>
        <button id="edit" title="edit this people object">Edit</button>
    </div>
</div><!-- END: .controls -->
</form><!-- END: form.form-people -->
`;

    /**
     * Check for cl_people_id being passed in URL
     */
    key = page_url.searchParams.get("cl_people_id");
    if (! key) {
        key = "";
    }
    console.log("DEBUG key now ->", key, typeof key);


    /**
     * Page functions
     */
    
    //console.log("DEBUG page_url", page_url);
    //console.log("DEBUG c_name", c_name);
    //console.log("DEBUG key ->", key, "<-");
    
    function setupAnchor(elem, link_text, prefix, suffix, value) {
        if (value === "" ) {
            elem.setAttribute("href", value);
            elem.innerHTML = "";
            return;
        }
        elem.setAttribute("href", prefix + value + suffix);
        elem.innerHTML = link_text;
    }
    
    function capitalize_word(w) {
        return w.charAt(0).toUpperCase()+w.slice(1);
    }
    
    function capitalize_string(s, sep = '-') {
        if (s === "") {
            return s;
        }
        return s.toLowerCase().split(sep).map(capitalize_word).join(sep);
    }
    
    function form_init() {
        let obj = this;
        if (obj.cl_people_id === undefined || obj.cl_people_id === "") {
            if (obj._Key !== undefined && obj._Key !== "") {
                obj.cl_people_id = obj._Key;
            } else if (key !== undefined && key !== "") {
                obj.cl_people_id = key;
                obj._Key = key;
            }
        }
        return true;
    }

    function render_form(elem, people, form_src, form_init) {
        elem.innerHTML = "";
        let field = CL.field(people, form_src, form_init);
console.log("DEBUG field", field);
        let form = CL.assembleFields(elem, field),
            /**
             * Now we add our event listeners and lookups using
             * vanilla JavaScript and CL.httpGet()..
             */
            family_name = form.querySelector("#family_name"),
            given_name = form.querySelector("#given_name"),
            cl_people_id = form.querySelector("#cl_people_id"),
            cl_people_url = form.querySelector("#cl_people_url"),
            thesis_id = form.querySelector("#thesis_id"),
            thesis_url = form.querySelector("#thesis_url"),
            authors_id = form.querySelector("#authors_id"),
            authors_url = form.querySelector("#authors_url"),
            archivesspace_id = form.querySelector("#archivesspace_id"),
            archivesspace_url = form.querySelector("#archivesspace_url"),
            directory_id = form.querySelector("#directory_id"),
            directory_url = form.querySelector("#directory_url"),
            viaf = form.querySelector("#viaf"),
            viaf_url = form.querySelector("#viaf_url"),
            lcnaf = form.querySelector("#lcnaf"),
            lcnaf_url = form.querySelector("#lcnaf_url"),
            isni_url = form.querySelector("#isni_url"),
            wikidata = form.querySelector("#wikidata"),
            wikidata_url = form.querySelector("#wikidata_url"),
            snac = form.querySelector("#snac"),
            snac_url = form.querySelector("#snac_url"),
            orcid = form.querySelector("#orcid"),
            orcid_url = form.querySelector("#orcid_url"),
            image = form.querySelector("#image"),
            image_url = form.querySelector("#image_url"),
            educated_at = form.querySelector("#educated_at"),
            caltech = form.querySelector("#caltech"),
            jpl = form.querySelector("#jpl"),
            faculty = form.querySelector("#faculty"),
            alumn = form.querySelector("#alumn"),
            notes = form.querySelector("#notes"),
            _State = form.querySelector("#_State"),
            _errors = form.querySelector("#errors"),
            _status = form.querySelector("#status"),
            edit = form.querySelector("#edit");
        
        // Setup rest of form.
        family_name.addEventListener("change", function(evt) {
            people.family_name = this.value;
        });
        given_name.addEventListener("change", function(evt) {
            people.given_name = this.value;
        });
        if (cl_people_id.value) {
            setupAnchor(cl_people_url, 
                'Check Feeds for ' + people.cl_people_id, 
                'https://feeds.library.caltech.edu/people/', 
                '',
                people.cl_people_id);
        }
        edit.addEventListener("click", function(evt) {
            console.log("DEBUG people before edit", people);
            if (people.cl_people_id === undefined || people.cl_people_id === "") {
                evt.preventDefault();
                return;
            }
            console.log("DEBUG people payload ->", JSON.stringify(people));
            _status.innerHTML = `Edit ${people.cl_people_id}`;
            _errors.innerHTML = '';
	    let u = new URL(window.location.href);
	    u.pathname = "/people/edit.html";
	    //u.search = "?cl_people_id=" + people.cl_people_id;
	    window.location.href = u.toString();
            evt.preventDefault();
        }, false);
        return elem;
    }


    /**
     * Main, apply main logic for page.
     */
    if (key !== undefined && key !== null && key !== "") {
        div.innerHTML = "Retrieving " + key;
        let updateOK = false,
            tid = -1;
        AndOr.readObject(c_name, key, function(data, err) {
            if (err) {
                div.innerHTML = `ERROR: Record ${key} not found, JSON API message ${err}`;
                people = Object.assign({}, default_people);
                render_form(div, people, form_src, form_init);
                let _errors = div.querySelector('#errors');
                _errors.innerHTML = `ERROR: Record ${key} not found, JSON API message ${err}`;
                clearInterval(tid);
                return;
            }
            people = Object.assign(people, data);
            render_form(div, people, form_src, form_init);
            let dt = new Date(),
                _status = div.querySelector('#status');
            _status.innerHTML = `Retrieved ${key} ${dt.toLocaleTimeString()}`;
            updateOK = true;
            if (tid >= 0) {
                clearInterval(tid);
            }
        });
        // We're polling for results here ...
        tid = setInterval(function() {
            if (updateOK == true) {
                clearInterval(tid);
            }
        }, 1 * 1000);
    } else {
	let u = new URL(window.location.href);
	u.pathname = "/people/";
	u.search = "";
	window.location.href = u.toString();
    }

    window.People = people; //DEBUG
}(document, window));
