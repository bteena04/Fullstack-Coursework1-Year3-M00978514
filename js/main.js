// js/main.js
var app = new Vue({
  el: '#app',
  data: {
    backendUrl: 'https://fullstack-coursework1-year3-expressapp.onrender.com', 
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

    // Search query
    searchQuery: '',

    // Shopping cart array to hold lesson IDs.
    cart: [],

    // Lessons data fetched from the server.
    lessons: [],

    // Orders data.
    order: {
      name: '',
      phoneNumber: ''
    },

    // Order validation states and messages.
    orderValidation: {
      nameError: false,
      phoneNumberError: false,
      nameErrorMessage: "Name must contain only letters.",
      phoneErrorMessage: "Phone number must contain only digits."
    },

    // Order status
    orderStatusMsg: '',

    // Search
    noSearchedItemFound: false,

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

    // Clear sorting data.
    clearSorting(){
      this.sortAttribute = "";
      this.sortOrder = "";
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

    // Method to check if the backend server and datais up.
    checkServerStatus(){
      return fetch(this.backendUrl)
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        this.serverStatus = data.dbConnected;
        this.fetchLessons(); // Fetch lessons after confirming server is up.
      })
      .catch(error => {
        this.serverStatus = false;
      });
    },

    // Method to fetch lessons from the server.
    fetchLessons(){
      return fetch(`${this.backendUrl}/collections/lessons`)
      .then(response => response.json())
      .then(res => {
        this.lessons =res; // store the fetched lessons in the lesson array.
      })
      .catch(error => {console.error("Error fetching lessons:", error)})
    },

    // Fetch a single lesson by its ID.
    fetchLessonById(id){
      return fetch(`${this.backendUrl}/collections/lessons/${id}`)
      .then(response => response.json())
      .then(res => {
        return res;
      })
      .catch(error => {console.error("Error fetching lesson by ID:", error)})
    },

    // Method for calling api lesson search.
    fetchLessonBySearchQuery(query){
      return fetch(`${this.backendUrl}/lessons/search?keyword=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(res => {
        return res;
      })
      .catch(err => {
        console.error("Error searching lessons.", err);
        return []; // return an empty array if an error has been encountered.
      })
    },

    // Method to search lesson based on user input in seach bar.
    searchLessons(){
      if(!this.searchQuery || this.searchQuery.trim() === ""){
        // If search input is empty return all lessons.
        this.fetchLessons();
        this.noSearchedItemFound =  false;
      } else {
        this.fetchLessonBySearchQuery(this.searchQuery)
        .then(searchedLessonData=> {
          this.lessons = searchedLessonData;

          // No match found.
          if (this.lessons.length ===0){
            this.noSearchedItemFound =  true;
          } else {
            this.noSearchedItemFound = false;
          }
        })
        .catch(err => {
          console.error("Error searching lessons:", err);
          this.noSearchedItemFound = true;
        });
      }
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
      const phonePattern = /^[0-9]+$/;

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
      return !this.orderValidation.nameError && !this.orderValidation.phoneNumberError;   
    },

    // Method to place an order.
    placeOrder(){
      const orderDate = new Date(); // Date type variable to hold the date the order has been placed.

      // Validate
      if (!this.validateOrderDetails()){
        return;
      }

      const orderDetails = {
        name: this.order.name,
        phoneNumber: this.order.phoneNumber,
        lessons: this.cart.map(item =>item.lessonId),
        orderDate: orderDate.toLocaleString()
      }

      return fetch(`${this.backendUrl}/checkout/place-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails)
      })
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        this.orderStatusMsg = `Your order number is ${data.orderId}`

        // Update stock after order placement.
        return this.updateStockAfterOrder()
      })
      .then(()=>{
        // Clear order details after successful order placement.
        this.order = { name: '', phoneNumber: '' };
        this.cart = [];
      })
      .catch(error => {
        this.orderStatusMsg = "Error placing order, please try again later."  
        console.error("Error placing order:", error);
      });
    },

    submitOrder() {
      this.placeOrder()
        .then(() => {
          // recall the fetch lessons
          return this.checkServerStatus();   
        })
        .then(() => {
          this.go('home');                 
        })
        .catch(err => {
          console.error("Error during order submission:", err);
        });
    },

    // Method to update lesson item.
    updateLessonAttribute(id, fieldsToUpdate){

      return fetch(`${this.backendUrl}/collections/lessons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldsToUpdate)
      })
      .then(response => {
        if(!response.ok) throw new Error("Network response was not ok");
        return response.json();
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

          // update the lesson's available stock after the current available stock is fetched.
          return this.updateLessonAttribute(item.lessonId,{ available: newAvailableStock});
        });    
      });

      return Promise.all(updatePromises);
    },

    triggerSuccessOrderMsg(){
      const toastLiveExample = document.getElementById('liveToast')
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

      toastBootstrap.show()
    }
  },
  computed: {
    
    sortedLessons() 
    {
      // Return the original lesson array if no sort attribute is provided.
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
    },

    isOrderValid() {
      const namePattern = /^[a-zA-Z\s]+$/;
      const phonePattern = /^[0-9]+$/; 
      return namePattern.test(this.order.name || '') && phonePattern.test(this.order.phoneNumber || '');
    }
  },
  // Lifecycle hook.
  created(){
    this.checkServerStatus();
    this.loadCartLessons();
  }
});
