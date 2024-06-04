# Instructions to Run the Project

1. Clone the Repository:

   ```shell
   git clone https://github.com/Namrah-99/movies-nestjs-nextjs-test-app.git
   cd movies-nestjs-nextjs-test-app
   ```

2. Install Dependencies for Both Server and Client:

   ```shell
   # For server-side dependencies
   cd servers
   npm install

   # For client-side dependencies
   cd ../clients/user-ui
   npm install
   ```

3. Set Up Environment Variables:

   - Copy the .env.example file to .env in both clients/user-ui and servers directories, and populate the required variables.

4. Build the Project:

   ```shell
   # Navigate to the root of the project
   cd ../..
   Remove-Item -Recurse -Force .\dist\
   npm run build
   ```

5. Generate Prisma Client and Push Schema to Database:

   ```shell
   cd servers
   npx prisma generate
   npx prisma db push
   ```

6. Seed the Database:

   ```shell
   npm run seed:clear
   npm run seed
   ```

7. Run Prisma Studio (Optional):

   ```shell
   npx prisma studio
   # Open http://localhost:5555/ in your browser to interact with the database
   ```

8. Start Microservices:

   ```shell
   cd servers

   # Start the users microservice
   npm run start:dev users

   # Open a new terminal and navigate to the servers directory
   cd servers

   # Start the admin microservice
   npm run start:dev admin

   # Open another new terminal and navigate to the servers directory
   cd servers

   # Start the gateway microservice
   npm run start:dev gateway
   ```

9. Start the Next.js Client Application:

   ```shell
   cd ../clients/user-ui
   npm run dev
   ```

## Final Notes:

- Ensure that all required environment variables are set correctly in the .env files.
- The microservices (users, admin, gateway) should be running simultaneously in different terminal windows.
- Access the Next.js application at `http://localhost:3000`.

## Screenshots

![MainPage](/readmeImages/mainpage.jpg)
![PrismaSeedData](/readmeImages/seedData.jpg)
![UserSeedData](/readmeImages/userseeddata.jpg)
![SignUp](/readmeImages/signup.jpg)
![ActivateUser](/readmeImages/verifyaccount.jpg)
![ActivationCodeEmail](/readmeImages/activationcodeemail.jpg)
![UserCreatedInDB](/readmeImages/userCreatedInDB.jpg)
![Forgot Password](/readmeImages/forgotpwd.jpg)
![ResetPwdEmail](/readmeImages/resetPwdEmail.jpg)
![Reset Password](/readmeImages/resetPwdForm.jpg)
![Login](/readmeImages/login.jpg)
![UserLoggedIn](/readmeImages/loggedinuserpage.jpg)
![UserProfileUpdate](/readmeImages/updateProfile.jpg)
![UserProfileImageUpdate](/readmeImages/updateprofileImage.jpg)
![BeforeRatingMovie](/readmeImages/beforeRating.jpg)
![RateMovieForm](/readmeImages/rateMovie.jpg)
![AfterRatingMovie](/readmeImages/afterRating.jpg)
![NewRatingPrismaDB](/readmeImages/newRating.jpg)
![registerUserGraphQLQueries](/readmeImages/emailAlreay.jpg)
![recommendedMoviesAdminGraphQLQueries](/readmeImages/adminGraphQLQueries.jpg)
![ratingAdminGraphQLQueries](/readmeImages/adminServiceGraphQLQueries.jpg)
