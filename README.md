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
    > apt install fuse

## Contributors

A big thank you goes to all contributors of ideas, code, docs and overall support!
