// js/main.js
var app = new Vue({
  el: '#app',
  data: {
    currentView: 'home',
    darkMode: true,
    logo: {
      darkMode: 'images/logo/logo_darkMode.png',
      lightMode: 'images/logo/logo_lightMode.png'
    },
    userLoginStatus: {
      isUserLoggedIn: true
    },

    // Sorting controls
    sortAttribute: '',
    sortOrder: 'asc',

    // Shopping cart array to hold lesson IDs.
    cart: [],

    // Lessons data fetched from the server.
    lessons: []    
  },
  methods: {
    go: function(view) {
      this.currentView = view;
    },
    isActive: function(view) {
      return this.currentView === view ? 'active' : '';
    },
    toggleTheme: function() {
      this.darkMode = !this.darkMode;
    },

    // Count how many particular item is in the cart.
    numberOfItemInCart(id){
      let count = 0;
      for (let item =0 ; item < this.cart.length; item++){
        if (this.cart[item] === id){
          count++;
        }
      }
      return count;
    },

    // Check if we can add more items to the cart based on availability.
    canAddToCart(lesson){
      return this.numberOfItemInCart(lesson.id) < lesson.available;
    },

    addToCart(lesson) {
      // Only add to cart if lesson is available.
      if (this.canAddToCart(lesson)) {
        this.cart.push(lesson.id);
      }
    },

    // Calculate how many items are left that can be added to the cart.
    itemsLeft(lesson) {
      return lesson.available - this.numberOfItemInCart(lesson.id);
    },

    removeLessonFromCart(lesson){
      // Find the index of the lesson to remove.
      const lessonToRemoveIndex = this.cart.indexOf(lesson.id);

      // Remove if the lesson is found in the cart.
      if (lessonToRemoveIndex > -1) {
        this.cart.splice(lessonToRemoveIndex, 1);
      }
    },
    // Method to fetch lessons from the server.
    fetchLessons(){
      fetch("https://fullstack-coursework1-year3-expressapp.onrender.com/collections/lessons")
      .then(response => response.json())
      .then(res => {
        this.lessons =res;
        console.log(this.lessons);
      })
      .catch(error => {console.error("Error fetching lessons:", error);})
      .finally(()=> console.log("Fetch attempt finished."));
    },
  },
  computed: {
    
    sortedLessons() 
    {
      if (!this.sortAttribute) return this.lessons;

      // Copy array to avoid modifying original
      let sorted = this.lessons.slice().sort((a, b) => {
        let valA = a[this.sortAttribute];
        let valB = b[this.sortAttribute];

        // Convert strings to lowercase for alphabetical comparison
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      return sorted;
    },

    // Tracks the number of items in the cart.
    itemsInCartLength(){
      return this.cart.length || "";
    }
  },
  // Lifecycle hook.
  created(){
    this.fetchLessons();
  }
});
