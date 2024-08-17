// Create a new wolf app
wolf new my-wolf-app

// Add something to the app
wolf gen
    > component
        # my-component
    > page
        # my-page


// Add a dependency to the app
wolf add
    > melte
    > firebase

// Start the app
wolf start

// Build the app
wolf build