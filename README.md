![Vigad](https://user-images.githubusercontent.com/58397976/209412078-1a7f2dfc-3ce8-4a7c-9ad6-2ca19a4e764d.png)

[![Build](https://github.com/VisualGameData/VIGAD/actions/workflows/publish-build.yml/badge.svg)](https://github.com/VisualGameData/VIGAD/actions/workflows/publish-build.yml)
[![Tests](https://github.com/VisualGameData/VIGAD/actions/workflows/main-test.yml/badge.svg)](https://github.com/VisualGameData/VIGAD/actions/workflows/main-test.yml?branch=main)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/e0714cc489084a76bfaccea19fa71a06)](https://app.codacy.com/gh/VisualGameData/VIGAD/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Github All Releases](https://img.shields.io/github/downloads/VisualGameData/VIGAD/total.svg)]()

## Description

Vigad is a desktop application built using Electron+Vue.js. Its primary function is to continuously extract data from one or more specified areas on the screen. For this image-to-text conversion, Vigad relies on [TesseractJS](https://tesseract.projectnaptha.com/). Additional configuration options allow to filter for specific (regular) expressions.

A common use case would be for example to extract the players health points from a shooter game and create a chart out of that data. Since Vigad provides a live-data-flow, it may also be possible to draw a live-map using coordinates provided on the screen.

Overall Vigad offers a wide range of use cases, even outside of gaming.

## Compatibility

Vigad has been tested on the following platforms:

-   Windows 10 and newer
-   Ubuntu 22.04 (likely to work on similar distributions as well)
-   Mac (13.3.1(a))

## Installation

Download the executable for the latest version [here](https://github.com/VisualGameData/VIGAD/releases/latest/) (Win: .exe, Linux: .AppImage, Mac: .dmg)

Note: In order to run the .AppImage executable, fuse is required.

-   Install fuse:
    ```
    apt install fuse
    ```

## QuickStart

1. Open the VIGAD application
2. Under "Source", select the screen or application window you want to extract data from
3. Under "Regex", click "ADD CAPTURE AREA" at the top
4. Position the newly appeared green box over the area you want to extract data from
5. Open up the dropdown menu of the capture area on the left
6. Configure the capture area
   - Capture Area ID: A unique identifier for the capture area. You will be able to identify your desired data using that ID later on
   - Search value: A regular expression for values you are searching for
   - Before/After Constraint: Regular expressions between which your desired value may be found
   - Options:
       ##### Matching:
         - Approximate: The value that is closest to your defined regex will be matched. An according rating for this match will be generated as well
         - Exact: Only values will be extracted that exactly match your defined regex
       ##### Slicing:
         - The type of algorithm to be used for parsing text extracted by the tesseract AI
         - Substring: Very accurate but very slow for large texts
         - Spaces: Mix between accuracy and performance
         - Entire String: Least accurate but most performant
       ##### Similarity:
         - Numbers to Letters: Convert numbers to similar looking letters
         - Letters to Numbers: Convert letters to similar looking numbers
         - None: Do not convert anything
7. Under "Session Settings", configure a token used to access your extracted data from the [VIGAD-API](https://github.com/VisualGameData/VIGAD-API) and select the data you want to share
8. Click "START SESSION" in the top right corner
9. Under Capturing, click "START" at the top

Data will now be extracted and (if configured correctly in .env & Session Settings) uploaded to the VIGAD-API. Currently you will need to build the application yourself in order to edit the VIGAD-API credentials.

## Build

1. Checkout the sourcecode:
```
git clone https://github.com/VisualGameData/VIGAD-API.git
```
2. If the VIGAD-API should be used, edit .env accordingly:
```
VITE_BASEURL: The URL to the VIGAD-API (eg. http://localhost:3000)
VITE_BEARERTOKEN: A token, the TOKEN_HASH in the VIGAD_API was generated from
```
4. Start the build process:
```
npm run build
```

## Contributors

A big thank you goes to all contributors of ideas, code, docs and overall support!
