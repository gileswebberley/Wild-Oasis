import { createGlobalStyle } from 'styled-components';

//Let's create some global styling using the styled components method
const GlobalStyles = createGlobalStyle`
:root {
    /* 
    These are CSS variables which are used with the var() css method.
    We can inject design tokens like these using the styled components 'themes' functionality (if you see $(props => props.theme) in code then that is what is being used) however css variables have become the standard way of doing the same
    */
  /* New green branding - for dark and light modes */
  --color-brand-50:rgb(236, 245, 238);
  --color-brand-100:rgb(200, 216, 203);
  --color-brand-200:rgb(182, 220, 189);
  --color-brand-500:rgb(131, 161, 136);
  --color-brand-600:rgb(100, 143, 108);
  --color-brand-700:rgb(73, 142, 85);
  --color-brand-800:rgb(41, 114, 54);
  --color-brand-900:rgb(27, 79, 37);
  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;
  --border-radius-xl: 14px;

  /* For the guest site's background image */
  --bg-blur-amount: 5px;

&, &.light-mode{
  /* Grey */
  --color-grey-0: #fff;
  --color-grey-50: #f9fafb;
  --color-grey-100: #f3f4f6;
  --color-grey-100-alpha:rgb(243, 244, 246, 0.6);
  --color-grey-200: #e5e7eb;
  --color-grey-300: #d1d5db;
  --color-grey-400: #9ca3af;
  --color-grey-500: #6b7280;
  --color-grey-600: #4b5563;
  --color-grey-700: #374151;
  --color-grey-800: #1f2937;
  --color-grey-900: #111827;

  --color-blue-100: #e0f2fe;
  --color-blue-700: #0369a1;
  --color-green-100: #dcfce7;
  --color-green-700: #15803d;
  --color-yellow-100: #fef9c3;
  --color-yellow-700: #a16207;
  --color-silver-100: #e5e7eb;
  --color-silver-700: #374151;
  --color-indigo-100: #e0e7ff;
  --color-indigo-700: #4338ca;
  --color-brown:rgba(199, 171, 145, 0.7); 

  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;

  --backdrop-color: rgba(255, 255, 255, 0.1);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);

  /* For light mode */
  --image-grayscale: 0;
  --image-opacity: 100%;
}

&.dark-mode{
--color-grey-0: #18212f;
--color-grey-50: #111827;
--color-grey-100: #1f2937;
--color-grey-100-alpha:rgb(31, 41, 55, 0.6);
--color-grey-200: #374151;
--color-grey-300: #4b5563;
--color-grey-400: #6b7280;
--color-grey-500: #9ca3af;
--color-grey-600: #d1d5db;
--color-grey-700: #e5e7eb;
--color-grey-800: #f3f4f6;
--color-grey-900: #f9fafb;

--color-blue-100: #075985;
--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;
--color-brown: #5e2e05; 

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
}
}

*,
*::before,
*::after {
    /* if you define content: in ::before or ::after it will automatically add it to the end of any of the defined classes/elements/ids, eg - to add the href property to the end of any a-tag you could write a::after{content: '(attr(href))';}, but it can also be used like this to add common styling to everything (that's what the * means).
    ps. you can also add custom attributes to elements with the [attr-name] method, so to have a span with a meta-desc attribute you'd write span[meta-desc] and then you could have spans like <span meta-desc='...'></span> */
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  /* This affects all changes to background-color, for example all button hovers will transition in 0.3s */
  transition: background-color 0.3s, border 0.3s;

  //hide scrollbars throughout the site to avoid the horrible affect on the layout when they appear - I think they are unneccessary with scroll wheels, trackpads, and finger controls?
  ::-webkit-scrollbar {
    display: none; /*Chrome, Safari and Opera */
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Poppins", sans-serif;
  color: var(--color-grey-900);
  //stop words from being broken as standard  
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;

  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

textarea:disabled,
select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: -1px;
}

input:is(:-webkit-autofill,:autofill){
  /* I can't change the blue background in chrome but I can do this */
  border-color: var(--color-brand-700);
}

/* Parent selector, finally 😃 */
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

//taking over the styling of react-datepicker when it's inline - this has suddenly stopped working!! It seems that adding !important to everything has forced the overrides to take effect again :/
.react-datepicker {
  font-family: "Poppins", helvetica, arial, sans-serif !important;
  font-size: inherit !important;
  background-color: var(--color-brand-600) !important;
  color: #000 !important;
  border: 2px solid var(--color-brand-600) !important;
  border-radius: var(--border-radius-sm) !important;
  display: inline-block !important;
  position: relative !important;
  line-height: inherit !important;
}
.react-datepicker__month-container {
  float: none !important;
  color:var(--color-brand-900) !important;
}
.react-datepicker__current-month {
  margin-top: 0 !important;
  color: #000 !important;
  font-weight: bold !important;
  font-size: 1.6rem !important;
}

.react-datepicker__day-name,
.react-datepicker__day,
.react-datepicker__time-name {
  color: #000 !important;
  display: inline-block !important;
  width: 2.7rem !important;
  text-align: center !important;
}
.react-datepicker__day:not([aria-disabled=true]):hover{
  border-radius: 0.3rem !important;
  background-color:var(--color-grey-400) !important;
}

.react-datepicker__day--today{
  font-weight: 600 !important;
  color: var(--color-green-100) !important;
  border: 1px dotted var(--color-green-100) !important;
}

.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range{
  border-radius: 0.3rem !important;
  background-color: #216ba5 !important;
  color: #fff !important;
}

.react-datepicker__day--selected:not([aria-disabled=true]):hover, .react-datepicker__day--in-selecting-range:not([aria-disabled=true]):hover, .react-datepicker__day--in-range:not([aria-disabled=true]):hover{
  background-color:#85a9c5 !important;
}

.react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range){
  background-color: rgba(33, 107, 165, 0.5) !important;
}

.react-datepicker__day--disabled{
  cursor: default !important;
  color: var(--color-red-700) !important;
  text-decoration: line-through !important;
}

.react-datepicker__header {
  /* text-align: center; */
  background-color: var(--color-brand-50) !important;
  border-bottom: 1px solid #aeaeae !important;
  border-top-left-radius: 0.3rem !important;
  padding: 8px 0 !important;
  position: relative !important;
}

`;
export default GlobalStyles;
