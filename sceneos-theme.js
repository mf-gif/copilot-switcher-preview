/* ============================================================
   SceneOS — shared Tailwind tokens  (SINGLE SOURCE OF TRUTH)
   Load AFTER the Tailwind CDN:
     <script src="https://cdn.tailwindcss.com"></script>
     <script src="sceneos-theme.js"></script>
     <link rel="stylesheet" href="sceneos-theme.css">
   Change the palette / font tokens here → every screen updates.
   ============================================================ */
tailwind.config = {
  theme: { extend: {
    fontFamily: {
      display: ['"Clash Display"', '"Geologica"', 'sans-serif'],
      sans:    ['"General Sans"', '"Onest"', 'sans-serif'],
      // mono utility now maps to the body font (3rd font removed)
      mono:    ['"General Sans"', '"Onest"', 'sans-serif'],
    },
    colors: {
      ink:'#08080B', panel:'#101015', panel2:'#16161D', line:'#23232C',
      mut:'#8A8A99', soft:'#B9B9C6',
      acc:'#4D7DFF', acc2:'#6E5BFF', vid:'#FF5C8A', img:'#FF9A3D',
      ok:'#34D399', star:'#FBBF24', warn:'#FBBF24', bad:'#FB6A5E',
    },
  }},
};

/* Status state machine — SINGLE SOURCE (data/tokens, shared like the colour palette).
   Shape: [label, hex]. Hex (not a CSS var) so each screen's LOCAL pill renderer can
   append an alpha suffix (e.g. `${c}1f`). Render stays local per screen — team rule:
   JS helpers local, only tokens/data shared. Unknown keys fall back in each renderer. */
window.SCENEOS_STATUS = {
  created:     ['Created',     '#8A8A99'],
  to_do:       ['To do',       '#4D7DFF'],
  in_progress: ['In progress', '#6E5BFF'],
  done:        ['Done',        '#34D399'],
  accepted:    ['Accepted',    '#34D399'],
};

/* ── Role-gating (P-14) ─ single source, predicate names per Drake's role-gating-spec so UI ↔ backend match.
   Read the viewer role lazily from <body data-shell-role="…"> (default 'pm'); loaded in <head> so it is
   available before any page render() runs (even where shell.js is deferred). Cost surfaces HIDE for the
   ungated (privacy), not just disable. Server-side RLS is Drake's enforcement; this is the UI expression. */
(function(){
  // Role source of truth: ?role= query (one-shot, persisted) → localStorage (demo switcher) → page default → pm.
  function role(){
    try{ var q=new URLSearchParams(location.search).get('role'); if(q){ localStorage.setItem('sos_role', q); } }catch(e){}
    var ls=null; try{ ls=localStorage.getItem('sos_role'); }catch(e){}
    return ls || (document.body && document.body.dataset.shellRole) || 'pm';
  }
  function is(){ var a=[].slice.call(arguments), r=role(); for(var i=0;i<a.length;i++) if(a[i]===r) return true; return false; }
  window.SOS_ROLE = role;
  window.__setRole = function(r){ try{ localStorage.setItem('sos_role', r); }catch(e){} location.reload(); };
  window.canSeeCost      = function(){ return is('admin','pm'); };               // cost/analytics/budget — HIDE otherwise
  window.canApprove      = function(){ return is('admin','pm','director'); };
  window.canCreateScene  = function(){ return is('admin','pm','director'); };
  window.canCutScene     = function(){ return is('admin','pm','director'); };    // cut SCENE (not cut variant — that's everyone)
  window.canAssignArtist = function(){ return is('admin','pm'); };
  window.canSetBudget    = function(){ return is('admin','pm'); };
  window.canManageTeam   = function(){ return is('admin','pm'); };
})();
