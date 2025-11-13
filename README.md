# Sqills Frontent Project

This project is React component library using React, TypeScript, and Material UI (MUI).


## Architecture Notes
This React component library is built for developer experience and type safety, leveraging the toolchain of Vite for fast development and TypeScript. The development experience is further enhanced with Storybook, which provides an isolated environment for visual testing and documentation. Theming is built on MUI's ThemeProvider, utilizing a shared theme package that defines consistent light and dark mode palettes. 

The library's architecture is designed for reusability and modularity. This is furture enhanced with centralized exports through index.ts files. The porject structure puts related components in the same folder.

The Components are flexible to developer changes. With the DestinationFilter, in order to ensure selected option consistency, the destinations selections are cleared when the mirror toggle changes.


## Features
- ThemeProvider
- AutocompleteSearch
- DestinationFilter



## Requiremnts
- NodeJS v20+
- npm 9.0+
- terminal access

## Getting Started

### Install Packages

From the project directory

```npm install```

### RUNNING PROJECT

- Dev Server &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;```npm run dev```

- Components Docs &nbsp; ```npm run storybook``` 

- Build Prod Packages &nbsp;```npm run build```



-----------------------
# More Information on Dev Environment

[Vite React TypeScript](https://vite.dev/guide/)

## Author

Nafiu Lawal 
- [Github](https://www.github.com/nafiudanlawal)
- [LinkedIn](https://www.linkedin.com/in/nafiudanlawal)

## License

[MIT](https://choosealicense.com/licenses/mit/)
