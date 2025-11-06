Vue.component('register', {
  template: `
    <form>
        <div class="container-sm mt-4">
            <div class="row justify-content-md-center">
                <div class="col-lg-8">
                    <h2 class="text-center mb-2">Welcome to XLearning!</h2>
                    <p class="text-center text-muted mb-4">
                        Sign in or create an account to explore after-school activities and classes.
                    </p>
                    <div class="card">
                        <div class="card-header text-center fw-bold">
                        Create Account
                    </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-3 col-md-5">
                                    <div class="input-group mb-3">
                                        <label class="input-group-text" for="userTypeSelect">User Type</label>
                                        <select class="form-select" id="userTypeSelect">
                                            <option selected>Choose...</option>
                                            <option value="parent">Parent</option>
                                            <option value="student">Student</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        
                            <div class="row">
                                <div class="col">
                                    <input type="text" id="register_FirstName" class="form-control" placeholder="First name" aria-label="First name">
                                </div>
                                <div class="col">
                                    <input type="text" id="register_LastName" class="form-control" placeholder="Last name" aria-label="Last name">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">
                                    <input type="text" id="register_FirstName" class="form-control" placeholder="First name" aria-label="First name">
                                </div>
                                <div class="col">
                                    <input type="text" id="register_LastName" class="form-control" placeholder="Last name" aria-label="Last name">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
  `,
    data: {},
    methods: {}
});
