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
    },

    // Array to hold quantity of each lesson in the cart.
    lessonQuantitiesinCart: []
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
      return this.numberOfItemInCart(lesson._id) < lesson.available;
    },

    addToCart(lesson) {
      // Only add to cart if lesson is available.
      if (this.canAddToCart(lesson)) {
        this.cart.push({ lessonId: lesson._id, lesson: lesson });
      }
    },

    // Calculate how many items are left that can be added to the cart.
    itemsLeft(lesson) {
      return lesson.available - this.numberOfItemInCart(lesson._id);
    },

    removeLessonFromCart(lesson){
      // Find the index of the lesson to remove.
      const lessonToRemoveIndex = this.cart.findIndex(item => item.lessonId === lesson._id);

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

    // Fetch a single lesson by its ID.
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

    // Cart: Load full lesson details for items in the cart using fetchLessonById.
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
        phoneNumber: this.order.phoneNumber,
        address: this.order.address,
        lessons: this.cart.map(item =>item.lessonId)
      }

      console.log("Order payload:", orderDetails);

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

        // Update stock after order placement.
        this.updateStockAfterOrder()
        .then(()=>{
          console.log("Stock updated after order.");
        });

        // Clear order details after successful order placement.
        this.order.name = '';
        this.order.phoneNumber = '';
        this.order.address = '';
        this.cart = [];
      })
      .catch(error => {
        console.error("Error placing order:", error);
      });
    },

    // Method to update lesson item by attribute.
    updateLessonAttribute(attributeName, id, newValue){

      return fetch(`${this.backendUrl}/collections/lessons/${id}?attribute=${attributeName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({[attributeName]: newValue})
      })
      .then(response => {
        if(!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data =>{
        console.log(`Lesson ${id} updated:`, data);
      })
      .catch(error => {
        console.error(`Error updating lesson ${id}:`, error);
      });
    },

    // Method to update stock after order placement.  
    updateStockAfterOrder(){
      const updatePromises = this.distinctCartItems.map(item => {

        // get quantity ordered for this item.
        const quantityOrdered = this.numberOfItemInCart(item.lessonId);

        // get available stock for this item.
        return this.fetchLessonById(item.lessonId).then(lessonData => {
          const newAvailableStock = lessonData.available - quantityOrdered;

          // update the lesson's available stock after the current avnailable stock is fetched.
          return this.updateLessonAttribute('available', item.lessonId, newAvailableStock);
        });    
      });

      return Promise.all(updatePromises);
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

    // Get distinct items in the cart.
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
