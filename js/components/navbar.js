// js/components/navbar.js
Vue.component('navbar', {
  template: '#navbar_template',
  data: function() {
    return {
      darkMode: true,
      logo: {
        darkMode: 'images/logo/logo_darkMode.png',
        lightMode: 'images/logo/logo_lightMode.png'
      },
      userLoginStatus: { 
        isUserLoggedIn: true 
      }
    };
  },
  methods: {
    toggleTheme: function() {
      this.darkMode = !this.darkMode;
    }
  }
});



