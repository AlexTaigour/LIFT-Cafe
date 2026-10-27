// Menu tabs
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function(tab){
    tab.setAttribute('tabindex', tab.getAttribute('aria-selected') === 'true' ? '0' : '-1');
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){
        t.setAttribute('aria-selected','false');
        t.setAttribute('tabindex','-1');
      });
      tab.setAttribute('aria-selected','true');
      tab.setAttribute('tabindex','0');
      document.querySelectorAll('.menu-panel').forEach(function(p){ p.classList.remove('active'); });
      document.getElementById('panel-' + tab.getAttribute('data-tab')).classList.add('active');
    });
    tab.addEventListener('keydown', function(ev){
      var index = Array.prototype.indexOf.call(tabs, tab);
      var nextIndex = index;
      if (ev.key === 'ArrowRight') { nextIndex = (index + 1) % tabs.length; }
      else if (ev.key === 'ArrowLeft') { nextIndex = (index - 1 + tabs.length) % tabs.length; }
      else if (ev.key === 'Home') { nextIndex = 0; }
      else if (ev.key === 'End') { nextIndex = tabs.length - 1; }
      else { return; }
      ev.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });

  // Open-now indicator, Brisbane time. Hours: Mon-Sat 06:00-14:00, Sun closed.
  (function(){
    try {
      var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Brisbane' }));
      var day = now.getDay(); // 0 = Sunday
      var mins = now.getHours() * 60 + now.getMinutes();
      var open = day !== 0 && mins >= 360 && mins < 840;
      var text = document.getElementById('openText');
      var dot = document.getElementById('openDot');
      if (open) { text.textContent = 'Open now — until 2:00 PM today'; }
      else {
        dot.classList.add('closed');
        text.textContent = day === 0 ? 'Closed today (Sunday) — see you Monday from 6 AM' : (mins < 360 ? 'Opens today at 6:00 AM' : 'Closed now — opens 6:00 AM ' + (day === 6 ? 'Monday' : 'tomorrow'));
      }
    } catch(e) { document.getElementById('openText').textContent = 'Mon–Sat 6:00 AM – 2:00 PM · Sun closed'; }
  })();

  // Cake enquiry: compose text only, never sends anything itself.
  document.getElementById('cakeForm').addEventListener('submit', function(ev){
    ev.preventDefault();
    var name = document.getElementById('fName').value.trim() || '—';
    var occ = document.getElementById('fOccasion').value;
    var date = document.getElementById('fDate').value || 'flexible';
    var size = document.getElementById('fSize').value;
    var notes = document.getElementById('fNotes').value.trim() || '—';
    var msg = 'Hi LIFT! I\'d love to enquire about a celebration cake.\n\n' +
      'Name: ' + name + '\nOccasion: ' + occ + '\nDate needed: ' + date +
      '\nSize: ' + size + '\nFlavours & ideas: ' + notes +
      '\n\nCould you please let me know options and a quote? Thank you!';
    var box = document.getElementById('enquiryResult');
    box.textContent = msg;
    box.classList.add('show');
    document.getElementById('resultActions').classList.add('show');
    box.setAttribute('data-msg', msg);
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('copyBtn').addEventListener('click', function(){
    var msg = document.getElementById('enquiryResult').getAttribute('data-msg') || '';
    var btn = this;
    if (navigator.clipboard && msg) {
      navigator.clipboard.writeText(msg).then(function(){ btn.textContent = 'Copied ✓'; setTimeout(function(){ btn.textContent = 'Copy enquiry text'; }, 2000); });
    }
  });