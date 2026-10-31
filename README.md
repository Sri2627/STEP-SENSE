# STEPSENSE

STEPSENSE is a responsive product and storefront website concept for footwear with vibration-based navigation and activity tracking. It is built with plain HTML, CSS, and JavaScript.

## Pages

- `index.html` — Product overview, navigation demo, app preview, use cases, design details, and contact information.
- `shop.html` — Product catalog with category filters and a shopping bag.

## Features

- Interactive direction and use-case demonstrations on the product page.
- Responsive navigation and reveal animations.
- Shop product filters and a browser-persisted shopping bag.
- Local CSS, JavaScript, and product imagery in `assets/`.

The shop is a front-end demonstration; it does not process orders or payments.

## Run locally

No build step or package installation is required. From the project folder, start a local web server:

```sh
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser. The shop is available at [http://localhost:8000/shop.html](http://localhost:8000/shop.html).

Some fonts and use-case photographs are loaded from external services, so those resources require an internet connection.

## Project structure

```text
.
├── index.html
├── shop.html
└── assets/
    ├── css/
    ├── images/
    └── js/
```
