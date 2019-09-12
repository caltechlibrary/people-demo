<!DOCTYPE html>
<html>
<head>
    <title>Caltech Library's Digital Library Development Sandbox</title>
    <link rel="stylesheet" href="/css/site.css">
</head>
<body>
<header>
<a href="https://library.caltech.edu"><img src="/assets/liblogo.gif" alt="Caltech Library logo"></a>
</header>
<nav>
<ul>
<li><a href="/">Home</a></li>
<li><a href="./">Demo Collection 01</a></li>
<li><a href="list.html">List All Objects</a></li>
<li><a href="list.html?keys=100,101,102,103">List Objects (paged)</a></li>
<li><a href="list.html?state=published">List Published Objects</a></li>
<li><a href="whoami.html">Who am I?</a></li>
</ul>
</nav>

<section>
<div id="object-view"></div>
<p>
<a id="object-json-view">JSON view</a><p>
</section>

<script src="/andor.js"></script>
<script>
(function (window, document) {
   "use strict";
    let c_name = "demo-collection-01",
        elem = document.getElementById("object-view"),
        anchor = document.getElementById("object-json-view"),
        u = new URL(window.location.href),
        objectID = u.searchParams.get("key");

    if (objectID && anchor !== undefined) {
        anchor.setAttribute("href", `/${c_name}/read/${objectID}`)
    } else {
        anchor.setAttribute("href", `/${c_name}/list.html`)
        anchor.innerHTML = "No object id specified, view List";
    }
    if (elem !== undefined) {
        AndOr.viewObject(elem, c_name, objectID);
    }
}(window, document));
</script>

<footer>
<span><h1><A href="https://caltech.edu">Caltech</a></h1></span>
<span>&copy; 2019 <a href="https://www.library.caltech.edu/copyright">Caltech library</a></span>
<address>1200 E California Blvd, Mail Code 1-32, Pasadena, CA 91125-3200</address> 
<span>Phone: <a href="tel:+1-626-395-3405">(626)395-3405</a></span>
<span><a href="mailto:library@caltech.edu">Email Us</a></span>
<a class="cl-hide" href="sitemap.xml">Site Map</a>
</footer>
</body>
</html>
