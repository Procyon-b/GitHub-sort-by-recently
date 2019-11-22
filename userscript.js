// ==UserScript==
// @name         GitHub: sort by recently updated
// @namespace    https://github.com/Procyon-b
// @version      0.3
// @description  Adds 2 links to sort by "recently updated" (issues & PR)
// @author       Achernar
// @match        https://github.com/*
// @run-at       document-end
// @grant        none
// @noframes
// ==/UserScript==

(function() {

'use strict';
var E=document.getElementById("js-repo-pjax-container");
//console.info('insert sort by recent?',E);
if (!E) { E=document.querySelector('.application-main main'); }
if (!E) return;
//console.info(E);

var obs=new MutationObserver(cb), config = { attributes: false, childList: true, subtree: false};
obs.observe(E, config);

function cb(mutL,o) {
  for(var mut of mutL) {
    if (mut.type == 'childList') {
      //console.log('A child node has been added or removed.',mut);
      addLink();
      }
    }
}

function addLink() {
  //console.info('addLink called');
  var e=E.querySelector('nav'), user;

  function aLink(e,q,st,st0) {
    if (!e) return;
    if (e.id) return;
    //console.info('addLink link added',e,q,arguments);
    var astyle=((st0!=undefined) && st0) || '', style='', url=e.href || e.parentNode.href, Q=url.indexOf('?')>=0;
    url+=(Q?'':'?q=')+(q?'+'+escape(q):'')+(Q?'':'+is%3Aopen')+'+sort%3Aupdated-desc';
    if ((url == location.href)) style+=( ((st!=undefined) && st) || 'background-color:#EEEEEE;');
    e.innerHTML+='<a style="color:inherit; text-decoration:inherit;'+astyle+'" href="'+url+'"> <span'+(style?' style="'+style+'"':'')+'>(r)</span> </a>';
    e.id="addedModifiedLink";
    }

  if (e) {
    aLink(e.querySelector(':scope span a[data-selected-links~="repo_issues"] span[itemprop="name"]'),'is:issue');
    aLink(e.querySelector(':scope span a[data-selected-links~="repo_pulls"] span[itemprop="name"]'),'is:pr');
    }
  if (user=document.head.querySelector(':scope meta[name="user-login"]')) {
    aLink(document.querySelector('nav[aria-label="Global"] a[href="/pulls"]'), 'is:open+is:pr+author:'+user.content+'+archived:false', ' ','zoom:80%;');
    aLink(document.querySelector('nav[aria-label="Global"] a[href="/issues"]'), 'is:open+is:issue+author:'+user.content+'+archived:false', ' ','zoom:80%;');
    }
  }

addLink();

})();
