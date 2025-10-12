// js/components/navbar.js
Vue.component('navbar', {
  template: '#navbar_template',
  props: ['currentView'], // Receive currentView as a prop from parent.
  data: function() {
    return {
      darkMode: true,
      logo: {
        darkMode: 'images/logo/logo_darkMode.png',
        lightMode: 'images/logo/logo_lightMode.png'
      },
      userLoginStatus: { 
        isUserLoggedIn: true 
      }//,
    //   navigateHtml: 'nav-link active aria-current="page" href="#" @click.prevent="go(\'' + view + '\')"' 
    };
  },
  methods: {
    toggleTheme: function() {
      this.darkMode = !this.darkMode;
    },
    go: function(view) {
      this.$emit('navigate', view);
    },
    isActive: function(view) {
      return this.currentView === view ? 'active' : '';
    }
  }
});



