// js/main.js
var app = new Vue({
  el: '#app',
  data: {
    backendUrl: 'http://localhost:3000', //https://fullstack-coursework1-year3-expressapp.onrender.com/
    serverStatus: null, // null = unknown, true = up, false = down
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
    lessons: [],

    // Orders data.
    order: {
      name: '',
      phoneNumber: '',
      address: ''
    },

    // Order validation states and messages.
    orderValidation: {
      nameError: false,
      phoneNumberError: false,
      nameErrorMessage: "Name must contain only letters and spaces.",
      phoneErrorMessage: "Phone number must contain only digits, spaces, dashes, parentheses, and may start with +."
    }
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
      return this.cart.filter(item => item.lessonId === id).length;
    },

    // Check if we can add more items to the cart based on availability.
    canAddToCart(lesson){
      return this.numberOfItemInCart(lesson.id) < lesson.available;
    },

    addToCart(lesson) {
      // Only add to cart if lesson is available.
      if (this.canAddToCart(lesson)) {
        this.cart.push({ lessonId: lesson.id, lesson: lesson });
        // this.cart.push(lesson.id);
      }
    },

    // Calculate how many items are left that can be added to the cart.
    itemsLeft(lesson) {
      return lesson.available - this.numberOfItemInCart(lesson.id);
    },

    removeLessonFromCart(lesson){
      // Find the index of the lesson to remove.
      const lessonToRemoveIndex = this.cart.findIndex(item => item.lessonId === lesson.id);

      // Remove if the lesson is found in the cart.
      if (lessonToRemoveIndex > -1) {
        this.cart.splice(lessonToRemoveIndex, 1);
      }
    },

    // Method to check if the backend server is up.
    checkServerStatus(){
      fetch(this.backendUrl)
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        this.serverStatus = true;
        this.fetchLessons(); // Fetch lessons after confirming server is up.
      })
      .catch(error => {
        this.serverStatus = false;
      });
    },

    // Method to fetch lessons from the server.
    fetchLessons(){
      fetch(`${this.backendUrl}/collections/lessons`)
      .then(response => response.json())
      .then(res => {
        this.lessons =res; // store the fetched lessons in the lesson array.
      })
      .catch(error => {console.error("Error fetching lessons:", error);})
      .finally(()=> console.log("Fetch attempt finished."));
    },

    fetchLessonById(id){
      return fetch(`${this.backendUrl}/collections/lessons/${id}`)
      .then(response => response.json())
      .then(res => {
        console.log("Fetched lesson by ID:", res._id);
        return res;
      })
      .catch(error => {console.error("Error fetching lesson by ID:", error)})
      .finally(()=> console.log("Fetch by ID attempt finished."))
    },

    loadCartLessons() {
      this.cart.forEach(item => {
        if (!item.lesson) {
          this.fetchLessonById(item.lessonId).then(lessonData => {
            item.lesson = lessonData;
          });
        }
      });
    },


    validateOrderDetails(){
      const namePattern = /^[a-zA-Z\s]+$/;
      const phonePattern = /^\+?[0-9\s\-()]+$/; 

      // Validate name
      if(!this.order.name || !namePattern.test(this.order.name)) {
        this.orderValidation.nameError = true;
      } else {
        this.orderValidation.nameError = false;
      }

      // Validate phone number
      if(!this.order.phoneNumber || !phonePattern.test(this.order.phoneNumber)) {
        this.orderValidation.phoneNumberError = true;
      } else {
        this.orderValidation.phoneNumberError = false;
      }

      // Returns true only if both are valid
      return !this.orderValidation.nameError && !this.orderValidation.phoneError;   
    },

    // Method to place an order.
    placeOrder(){
      if (!this.validateOrderDetails()){
        return;
      }

      const orderDetails = {
        name: this.order.name,
        phoneNumber: this.order.phoneNumber
      }

      fetch(`${this.backendUrl}/checkout/place-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails)
      })
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        console.log("Order placed successfully:", data);
        // Clear order details after successful order placement.
        this.order.name = '';
        this.order.phoneNumber = '';
      })
      .catch(error => {
        console.error("Error placing order:", error);
      });
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
    },

    distinctCartItems() {
      const seen = new Set();
      return this.cart.filter(item => {
        if (seen.has(item.lessonId)) return false;
        seen.add(item.lessonId);
        return true;
      });
      }
  },
  // Lifecycle hook.
  created(){
    this.checkServerStatus();
    this.loadCartLessons();
  }
});
