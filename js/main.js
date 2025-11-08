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
    cart: [],

    // Lesson Data.
    lessons: [
      { 
        id: 1,
        description: 'Learn the basics of algebra, geometry, and calculus with our expert tutors.', 
        img: 'images/lesson_images/guitar.jpg',
        subject: 'Maths', 
        location: 'Flic en flac', 
        price: 50, 
        available: 4
      },
      { 
        id: 2, 
        description: 'Explore the world of atoms, molecules, and reactions with hands-on experiments.',
        img: 'images/lesson_images/guitar.jpg',
        subject: 'Chemistry', 
        location: 'Riche Terre', 
        price: 15, 
        available:60
      },
      { 
        id: 3, 
        description: 'Master chords, strumming patterns, and music theory to become a skilled guitarist.',
        img: 'images/lesson_images/guitar.jpg',
        subject: 'Guitar', 
        location: 'Port Louis', 
        price: 35, 
        available:40
      },
      { 
        id: 4, 
        description: 'Dive into physics concepts like motion, energy, and forces with engaging lessons.',
        img: 'images/lesson_images/guitar.jpg',
        subject: 'Science', 
        location: 'Montagne Longue', 
        price: 80, 
        available:55
      },
      { 
        id: 5, 
        description: 'Learn to play beautiful melodies and understand music theory with our piano lessons.',
        img: 'images/lesson_images/guitar.jpg',
        subject: 'Piano', 
        location: 'Arsenal', 
        price: 75, 
        available:10
      },
      { 
        id: 6, 
        description: 'Get behind the wheel with confidence through our comprehensive driving lessons.',
        img: 'images/lesson_images/guitar.jpg',
        subject: 'Driving', 
        location: 'Triolet', 
        price: 120, 
        available:'8' 
      }
    ]
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

    addToCart(lesson) {
      if (this.canAddToCart(lesson)) {
        this.cart.push(lesson.id);
      }
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
    }

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
  }
});
