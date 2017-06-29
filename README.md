## Form Builder Challenge

This program in this repo creates a dynamic form builder that takes user input and builds a tree structure based on previous user responses. Users can add whatever information they want in the form of question and answer and can create unlimited sub-responses to their previous input. User input is dynamically added to localStorage and can be immediately previewed in the preview tab. The responses are also turned into JSON in the export tab.

### Set up and execution instructions
The program is written in React. To run the program:
1. Clone the repo.
2. Run `npm install`.
3. Open another terminal in the same directory and run `webpack --watch`
4. To run on localhost, you can run `python -m SimpleHTTPServer` and open `http://localhost:8000/` if you have Python installed. Alternative is to just copy the filepath of the html into the browser.

### Program structure
The form builder utilizes a recursive structure which can create unlimited sub-inputs by the users at unlimited depths. This structure is achieved with React where the component `SubInput` can recreate another copy of itself as the child of another `Subinput` component. The parent input component `RootInput` because it has a few slight differences compare to `SubInput`. The program utilizes local storage in the browser to save the data and is persistent as the components are build based on the current information in local storage. The data is saved in a tree like format in local storage to make the recursive input structure possible. The program also makes strong use of promises in order to make sure the front end is not rendering before the data has been recorded. 
