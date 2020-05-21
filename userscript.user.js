// ==UserScript==
// @name         GitHub: sort by recently updated
// @namespace    https://github.com/Procyon-b
// @version      0.5.2
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
if (!E) { E=document.querySelector('.application-main main'); }
if (!E) return;

var TO, obs=new MutationObserver(cb), config = { attributes: false, childList: true, subtree: false};
obs.observe(E, config);

function cb(mutL,o) {
  for(var mut of mutL) {
    if (mut.type == 'childList') {
      //console.log('A child node has been added or removed.',mut);
      if (TO) clearTimeout(TO);
      TO=setTimeout(addLink,0);
      }
    }
}

function addLink() {
  var e=E.querySelector('nav'), user;

  function aLink(e,q,st,st0) {
    if (!e) return;
    if (e.id) return;
    var astyle=((st0!=undefined) && st0) || '', style='', url=e.href || e.parentNode.href, Q=url.indexOf('?')>=0;
    url+=(Q?'':'?q=')+(q?'+'+escape(q):'')+(Q?'':'+is%3Aopen')+'+sort%3Aupdated-desc';
    if ((url == location.href)) style+=( ((st!=undefined) && st) || 'background-color:#EEEEEE;');
    e.innerHTML+='<a style="color:inherit; text-decoration:inherit;'+astyle+'" href="'+url+'"> <span'+(style?' style="'+style+'"':'')+'>(r)</span> </a>';
    e.id="addedModifiedLink";
    }

  user=document.head.querySelector(':scope meta[name="user-login"]');
  if (e) {
    aLink(e.querySelector(':scope span a[data-selected-links~="repo_issues"] span[itemprop="name"], :scope li a[data-selected-links~="repo_issues"] span[itemprop="name"]'),'is:issue');
    aLink(e.querySelector(':scope span a[data-selected-links~="repo_pulls"] span[itemprop="name"], :scope li a[data-selected-links~="repo_pulls"] span[itemprop="name"]'),'is:pr');
    let aria=e.attributes['aria-label'], c, RE;
    if (aria && ['Issues','Pull Requests'].includes(aria.value) ) {
      if (!e.id) {
        RE=new RegExp('\\+(author|assignee|mentions)%3A'+user.content);
        e.id='addedCommenter';
        c=e.firstElementChild.cloneNode(true);
        c.innerText='Commenter';
        c.title=aria.value+' you commented';
        c.attributes['aria-label'].value=aria.value+' you commented';
        c.removeAttribute('aria-current');
        c.id='commenter';
        let u=c.href.replace(RE,'+commenter%3A'+user.content);
        if (u.startsWith(location.origin)) u=u.substr(location.origin.length);
        c.href=u;
        c.dataset.selectedLinks='dashboard_commented '+u;
        c.classList.remove('selected');
        e.appendChild(c);
        setTimeout(addLink,0);
        if (aria.value=='Pull Requests') e.innerHTML+='<style>.subnav-search-input-wide {width: 450px;}</style>';
        }
      else {
        let cmt='+commenter%3A'+user.content, sel=e.getElementsByClassName('selected');
        RE=new RegExp('\\+commenter%3A'+user.content,'g');
        for (let c,i=0; c=e.children[i]; i++) {
          if (!c.href) continue;
          if ( (c.id=='commenter') && !sel.length) c.classList.add('selected');
          let u=c.href.replace(RE, '');
          if (u.startsWith(location.origin)) u=u.substr(location.origin.length);
          c.href=u+(c.id=='commenter'?cmt:'');
          c.dataset.selectedLinks=c.dataset.selectedLinks.replace(RE, '')+(c.id=='commenter'?cmt:'');
          }
        }
      }
    }
  if (user) {
    aLink(document.querySelector('nav[aria-label="Global"] a[href="/pulls"]'), 'is:open+is:pr+author:'+user.content+'+archived:false', ' ','font-size:0.8em;');
    aLink(document.querySelector('nav[aria-label="Global"] a[href="/issues"]'), 'is:open+is:issue+author:'+user.content+'+archived:false', ' ','font-size:0.8em;');
    }
  }

addLink();

})();
