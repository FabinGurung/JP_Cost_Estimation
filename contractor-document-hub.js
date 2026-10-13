/* Keep approved summary bookmarks working after introducing document sections. */
(() => {const q=new URLSearchParams(location.search);if(['items','candidates'].includes(q.get('view'))||q.has('item'))location.replace('contractor-road-work-summary.html'+location.search+location.hash);})();
