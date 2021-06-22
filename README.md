# HTML-Templating
A way of building pages by inserting HTML from templates

This is a templating project that I am using to test various templating techniques.  I started last year, in prep for the FPR rewrite, to settle on an approach to developing it.  
Last year, I had just about settled on a style that treated every single HTML template the same: Content wrapped in a div with the id "CONTENT_DIV".  With every single template having that same id, I would always have a reference to it, and I could know for certain that I could find it once it had been injected into the page.  So, I'd grab the template, stuff it into the page, and immediately find "CONTENT_DIV" and change it to a unique ID, and call it done.

That changed to a slightly modified version where I took the DIV wrapped content and extracted it's innerHTML, and injected that into the page.  That way I didn't have a bunch of wrapper divs laying about the place.

Now, I've taken a different approach where my HTML templates have nothing but the actual needed HTML with no wrapper divs at all. By taking advantage of JavaScript's prototypal inheritance, I can modify the DIV element and add a "LoadTemplate()" method. The benefit of that is that as soon as you do that, ALL divs on the page now have a "LoadFromTemplate()" method and can build and render *themselves*.

Every template is completely self contained.  It contains the HTML it needs to render.  It contains any CSS styling it needs for positioning and appearance.  And it can contain any script it needs to do it's work.  Scripts in a template will "fire" when the template is inserted into the DOM.

Also, templates can be nested.  That is, templates can load other templates, which can load other templates, etc.  I have not  tested, yet, whether an infinite loop can occur if two templates load each other, but I will eventually.  I also have not yet  tested what happens when functions scripts in a template collide with functions of the same name in other templates.  That, too needs to be tested.

One issue with loading scripts from template is that, unlike other static HTML content, <script> tags that are injected into the page are dead on arrival.  Since they were not there when the page initially loaded, the page is unaware of them.  So, the LoadTemplate() method prototype extension finds all script tags in the template, and creates NEW scripts in the target document, and inserts their innerHTML.  Then the new script is appended to the page, and thus becomes a live, active script that the page actually can see.

Next steps, data binding. 

NOTE 1:

When loading a page from the web server, you can use "document.addEventListener("DOMContentLoaded", () => {})" to initiate your template loading.  But, none of the templates themselves can use that event listener.  If Page1 loads content from Page2 when it loads, then Page2 will never see the "Page is Loaded" event because it's already over.  However, templates can contain script that can be loaded in a similar way by using "() => {}" syntax.  This *will* be seen by the page, and will execute at the time it is injected.  

So, you will see DOMCOntentLoaded only in index.html (and other top level pages), and after that, you will only see anonymous functions instead.  I'd almost trust DOMContentLoaded EvenListener, because it is specifically designed to fire only once the DOM content is completely loaded.  That's it's actual purpose.  But you can't use it in templates.

