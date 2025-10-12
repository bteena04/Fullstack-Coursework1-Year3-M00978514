// js/main.js
var app = new Vue({
  el: '#app',
  data: {
    currentView: 'home' // Default view
  },
  methods: {
    navigate: function(view) {
      this.currentView = view;
    }
  }
});

