// ==UserScript==
// @name         Github: sort by recently updated
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds 2 links to sort by "recently updated" (issues & PR)
// @author       Achernar
// @match        https://github.com/*/*
// @run-at       document-end
// @grant        none
// @noframes
// ==/UserScript==

(function() {

'use strict';
var E=document.getElementById("js-repo-pjax-container");
//console.info('insert sort by recent?',E);
if (!E) { E=document.querySelector('nav.reponav'); E=E && E.parentNode.parentNode; }
if (!E) return;
//console.info(E);

var obs=new MutationObserver(cb), config = { attributes: false, childList: true, subtree: false};
obs.observe(E, config);

var to=0;

function cb(mutL,o) {
  for(var mut of mutL) {
    if (mut.type == 'childList') {
      //console.log('A child node has been added or removed.',mut);
      //if (!to) to=setTimeout(addLink,0)
      addLink();
      }
    }
}

function addLink() {
  //console.info('addLink called');
  to=0;
  var e=E.querySelector('nav');

  function aLink(e,q) {
    if (!e) return;
    if (e.id) return;
    //console.info('addLink link added',e,q);
    var url=e.parentNode.href+'?q='+(q?escape(q):'')+'+is%3Aopen+sort%3Aupdated-desc', style='';
    if (url == location.href) style='background-color:#EEEEEE;'
    e.innerHTML+='<a style="color:inherit; text-decoration:inherit;" href="'+url+'"> <span style='+style+'>(r)</span> </a>';
    e.id="addedModifiedLink";
    }
  
  aLink(e.querySelector('span a[data-selected-links~="repo_issues"] span[itemprop="name"]'),'is:issue');
  aLink(e.querySelector('span a[data-selected-links~="repo_pulls"] span[itemprop="name"]'),'is:pr');
  }

addLink();

})();