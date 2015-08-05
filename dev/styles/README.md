#Style Guide

To manage our work we can separate styles to *2 types*:
- global style features for all project (for example, input and button corners, colors for interface elements etc.)
- layout of main interface elements


###Global style features
**Global style features** can contain both rules for tags and specific classes. All this shoud be stored in one file (with lots of comments). For example:

```
button, .btn { // common rules for all buttons
    border: none;
    border-radius: 2px;
}
    
btn.important { // all big buttons
    padding: 15px;
    color: white;
}

btn.ok-btn { // specific button 'Ok'
    background: green;
}
```
**Specific to page styles** (like margins, gaps between elements, some small style fixes) should be stored in separate files for each page (`main-page-style.scss`).

Also we can make *one file with sass-variables* to store colors, fonts and some size-values (if we use them to calculate other values) in one place. This variables can be used in all other scss-files without copying.


###Layout of main interface elements
According to layout, we have *3 types of pages*:
- start page
- pages with app interface
- specific page for statistics

So we can separate all layout to 3 files: `start-page-layout.scss`, `app-pages-layout.scss` and `stat-page-layout.scss`. 

Also we can create separate layout scss-files for tablet and mobile resolutions. To simply recognise them add `-tablet.scss` or `-desktop.scss` to their names (for example, `stat-page-layout-tablet.scss`). Style features for specific resolution (like another color in mobile version) can be added to global style file or specefic style file for that page.


#####So, in conclusion...
We expect to have:

- `variables.scss`
- `global-styles.scss`

- `start-page-layout.scss`
- `start-page-layout-tablet.scss`
- `start-page-layout-mobile.scss`

- `app-pages-layout.scss`
- `app-pages-layout-tablet.scss`
- `app-pages-layout-mobile.scss`

- `stat-page-layout.scss`
- `stat-page-layout-tablet.scss`
- `stat-page-layout-mobile.scss`

- Other style files for specific pages - `main-page-style.scss`, `info-page-style.scss`, `stat-page-style.scss` etc.