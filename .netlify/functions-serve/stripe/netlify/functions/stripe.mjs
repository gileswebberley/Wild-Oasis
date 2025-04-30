
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);

var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// netlify/functions/stripe.js
var stripe = __require("stripe")(process.env.STRIPE_SECRET);
var currentHostUrl = "https://wild-oasis-demo.netlify.app";
async function handler(req, context) {
  const { cabinName, amount } = context.params;
  console.log(`cabinName from stripe - ${cabinName}`);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Your stay at our cabin called " + decodeURI(cabinName)
          },
          unit_amount: Math.floor(amount * 100)
        },
        quantity: 1
      }
    ],
    mode: "payment",
    ui_mode: "embedded",
    return_url: `${currentHostUrl}/successful-payment/{CHECKOUT_SESSION_ID}`
  });
  const res_body = JSON.stringify({
    session_id: session.id,
    clientSecret: session.client_secret
  });
  const res_options = { status: 200 };
  return new Response(res_body, res_options);
}
var config = {
  path: "/api/stripe/:cabinName/:amount"
};
export {
  config,
  handler as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvc3RyaXBlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBzdHJpcGUgPSByZXF1aXJlKCdzdHJpcGUnKShwcm9jZXNzLmVudi5TVFJJUEVfU0VDUkVUKTtcclxuLy8gY29uc3QgY3VycmVudEhvc3RVcmwgPSAnaHR0cDovL2xvY2FsaG9zdDo4ODg4JzsvL2RldiB3aXRoIG5ldGxpZnkgY2xpXHJcbmNvbnN0IGN1cnJlbnRIb3N0VXJsID0gJ2h0dHBzOi8vd2lsZC1vYXNpcy1kZW1vLm5ldGxpZnkuYXBwJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCBjb250ZXh0KSB7XHJcbiAgY29uc3QgeyBjYWJpbk5hbWUsIGFtb3VudCB9ID0gY29udGV4dC5wYXJhbXM7XHJcbiAgY29uc29sZS5sb2coYGNhYmluTmFtZSBmcm9tIHN0cmlwZSAtICR7Y2FiaW5OYW1lfWApO1xyXG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBzdHJpcGUuY2hlY2tvdXQuc2Vzc2lvbnMuY3JlYXRlKHtcclxuICAgIGxpbmVfaXRlbXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIHByaWNlX2RhdGE6IHtcclxuICAgICAgICAgIGN1cnJlbmN5OiAnZ2JwJyxcclxuICAgICAgICAgIHByb2R1Y3RfZGF0YToge1xyXG4gICAgICAgICAgICBuYW1lOiAnWW91ciBzdGF5IGF0IG91ciBjYWJpbiBjYWxsZWQgJyArIGRlY29kZVVSSShjYWJpbk5hbWUpLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHVuaXRfYW1vdW50OiBNYXRoLmZsb29yKGFtb3VudCAqIDEwMCksXHJcbiAgICAgICAgfSxcclxuICAgICAgICBxdWFudGl0eTogMSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBtb2RlOiAncGF5bWVudCcsXHJcbiAgICB1aV9tb2RlOiAnZW1iZWRkZWQnLFxyXG4gICAgcmV0dXJuX3VybDogYCR7Y3VycmVudEhvc3RVcmx9L3N1Y2Nlc3NmdWwtcGF5bWVudC97Q0hFQ0tPVVRfU0VTU0lPTl9JRH1gLFxyXG4gIH0pO1xyXG4gIGNvbnN0IHJlc19ib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgc2Vzc2lvbl9pZDogc2Vzc2lvbi5pZCxcclxuICAgIGNsaWVudFNlY3JldDogc2Vzc2lvbi5jbGllbnRfc2VjcmV0LFxyXG4gIH0pO1xyXG4gIGNvbnN0IHJlc19vcHRpb25zID0geyBzdGF0dXM6IDIwMCB9O1xyXG4gIHJldHVybiBuZXcgUmVzcG9uc2UocmVzX2JvZHksIHJlc19vcHRpb25zKTtcclxufVxyXG5cclxuLy9UaGlzIHNldHMgdGhlIHBhdGggdGhhdCB5b3UgdXNlIGluIHlvdXIgZmV0Y2ggcmVxdWVzdCAtIHNlZSB0aGUgQ2hlY2tvdXQgZm9yIGFuIGV4YW1wbGVcclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcclxuICBwYXRoOiAnL2FwaS9zdHJpcGUvOmNhYmluTmFtZS86YW1vdW50JyxcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFNBQVMsVUFBUSxRQUFRLEVBQUUsUUFBUSxJQUFJLGFBQWE7QUFFMUQsSUFBTSxpQkFBaUI7QUFFdkIsZUFBTyxRQUErQixLQUFLLFNBQVM7QUFDbEQsUUFBTSxFQUFFLFdBQVcsT0FBTyxJQUFJLFFBQVE7QUFDdEMsVUFBUSxJQUFJLDJCQUEyQixTQUFTLEVBQUU7QUFDbEQsUUFBTSxVQUFVLE1BQU0sT0FBTyxTQUFTLFNBQVMsT0FBTztBQUFBLElBQ3BELFlBQVk7QUFBQSxNQUNWO0FBQUEsUUFDRSxZQUFZO0FBQUEsVUFDVixVQUFVO0FBQUEsVUFDVixjQUFjO0FBQUEsWUFDWixNQUFNLG1DQUFtQyxVQUFVLFNBQVM7QUFBQSxVQUM5RDtBQUFBLFVBQ0EsYUFBYSxLQUFLLE1BQU0sU0FBUyxHQUFHO0FBQUEsUUFDdEM7QUFBQSxRQUNBLFVBQVU7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsWUFBWSxHQUFHLGNBQWM7QUFBQSxFQUMvQixDQUFDO0FBQ0QsUUFBTSxXQUFXLEtBQUssVUFBVTtBQUFBLElBQzlCLFlBQVksUUFBUTtBQUFBLElBQ3BCLGNBQWMsUUFBUTtBQUFBLEVBQ3hCLENBQUM7QUFDRCxRQUFNLGNBQWMsRUFBRSxRQUFRLElBQUk7QUFDbEMsU0FBTyxJQUFJLFNBQVMsVUFBVSxXQUFXO0FBQzNDO0FBR08sSUFBTSxTQUFTO0FBQUEsRUFDcEIsTUFBTTtBQUNSOyIsCiAgIm5hbWVzIjogW10KfQo=
