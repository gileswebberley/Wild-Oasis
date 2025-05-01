
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// netlify/functions/stripe.js
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET);
var currentHostUrl = "https://wild-oasis-demo.netlify.app";
async function handler(req, context) {
  const reqBody = await req.json();
  const { product, cost } = reqBody;
  console.log(`cabinName from stripe - ${product}`);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Your stay at our cabin called " + decodeURI(product)
          },
          unit_amount: Math.floor(cost * 100)
        },
        quantity: 1
      }
    ],
    mode: "payment",
    ui_mode: "embedded",
    return_url: `${currentHostUrl}/successful-payment?session_id={CHECKOUT_SESSION_ID}`
  });
  const res_body = JSON.stringify({
    session_id: session.id,
    clientSecret: session.client_secret
  });
  const res_options = { status: 200 };
  return new Response(res_body, res_options);
}
var config = {
  path: "/api/stripe"
};
export {
  config,
  handler as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvc3RyaXBlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgU3RyaXBlIGZyb20gJ3N0cmlwZSc7XHJcbmNvbnN0IHN0cmlwZSA9IG5ldyBTdHJpcGUocHJvY2Vzcy5lbnYuU1RSSVBFX1NFQ1JFVCk7XHJcbi8vIGNvbnN0IGN1cnJlbnRIb3N0VXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OCc7IC8vZGV2IHdpdGggbmV0bGlmeSBjbGlcclxuY29uc3QgY3VycmVudEhvc3RVcmwgPSAnaHR0cHM6Ly93aWxkLW9hc2lzLWRlbW8ubmV0bGlmeS5hcHAnO1xyXG5cclxuLy9Ob3RlIHRoYXQgZm9yIE5ldGxpZnkgaXQgZG9lcyBub3QgbWF0dGVyIHdoYXQgeW91IG5hbWUgeW91ciBmdW5jdGlvbnMgYXMgbG9uZyBhcyB0aGV5IGZvbGxvdyB0aGUgZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcGF0dGVyblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgY29udGV4dCkge1xyXG4gIGNvbnN0IHJlcUJvZHkgPSBhd2FpdCByZXEuanNvbigpO1xyXG4gIC8vIGNvbnNvbGUubG9nKGByZXF1ZXN0IGJvZHkgLSAke0pTT04uc3RyaW5naWZ5KHJlcUJvZHkpfWApO1xyXG4gIGNvbnN0IHsgcHJvZHVjdCwgY29zdCB9ID0gcmVxQm9keTtcclxuICBjb25zb2xlLmxvZyhgY2FiaW5OYW1lIGZyb20gc3RyaXBlIC0gJHtwcm9kdWN0fWApO1xyXG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBzdHJpcGUuY2hlY2tvdXQuc2Vzc2lvbnMuY3JlYXRlKHtcclxuICAgIGxpbmVfaXRlbXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIHByaWNlX2RhdGE6IHtcclxuICAgICAgICAgIGN1cnJlbmN5OiAnZ2JwJyxcclxuICAgICAgICAgIHByb2R1Y3RfZGF0YToge1xyXG4gICAgICAgICAgICBuYW1lOiAnWW91ciBzdGF5IGF0IG91ciBjYWJpbiBjYWxsZWQgJyArIGRlY29kZVVSSShwcm9kdWN0KSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB1bml0X2Ftb3VudDogTWF0aC5mbG9vcihjb3N0ICogMTAwKSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICAgIG1vZGU6ICdwYXltZW50JyxcclxuICAgIHVpX21vZGU6ICdlbWJlZGRlZCcsXHJcbiAgICByZXR1cm5fdXJsOiBgJHtjdXJyZW50SG9zdFVybH0vc3VjY2Vzc2Z1bC1wYXltZW50P3Nlc3Npb25faWQ9e0NIRUNLT1VUX1NFU1NJT05fSUR9YCxcclxuICB9KTtcclxuICBjb25zdCByZXNfYm9keSA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgIHNlc3Npb25faWQ6IHNlc3Npb24uaWQsXHJcbiAgICBjbGllbnRTZWNyZXQ6IHNlc3Npb24uY2xpZW50X3NlY3JldCxcclxuICB9KTtcclxuICBjb25zdCByZXNfb3B0aW9ucyA9IHsgc3RhdHVzOiAyMDAgfTtcclxuICByZXR1cm4gbmV3IFJlc3BvbnNlKHJlc19ib2R5LCByZXNfb3B0aW9ucyk7XHJcbn1cclxuXHJcbi8vVGhpcyBzZXRzIHRoZSBwYXRoIHRoYXQgeW91IHVzZSBpbiB5b3VyIGZldGNoIHJlcXVlc3QgLSBzZWUgdGhlIENoZWNrb3V0IGZvciBhbiBleGFtcGxlXHJcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XHJcbiAgcGF0aDogJy9hcGkvc3RyaXBlJyxcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUFBLE9BQU8sWUFBWTtBQUNuQixJQUFNLFNBQVMsSUFBSSxPQUFPLFFBQVEsSUFBSSxhQUFhO0FBRW5ELElBQU0saUJBQWlCO0FBR3ZCLGVBQU8sUUFBK0IsS0FBSyxTQUFTO0FBQ2xELFFBQU0sVUFBVSxNQUFNLElBQUksS0FBSztBQUUvQixRQUFNLEVBQUUsU0FBUyxLQUFLLElBQUk7QUFDMUIsVUFBUSxJQUFJLDJCQUEyQixPQUFPLEVBQUU7QUFDaEQsUUFBTSxVQUFVLE1BQU0sT0FBTyxTQUFTLFNBQVMsT0FBTztBQUFBLElBQ3BELFlBQVk7QUFBQSxNQUNWO0FBQUEsUUFDRSxZQUFZO0FBQUEsVUFDVixVQUFVO0FBQUEsVUFDVixjQUFjO0FBQUEsWUFDWixNQUFNLG1DQUFtQyxVQUFVLE9BQU87QUFBQSxVQUM1RDtBQUFBLFVBQ0EsYUFBYSxLQUFLLE1BQU0sT0FBTyxHQUFHO0FBQUEsUUFDcEM7QUFBQSxRQUNBLFVBQVU7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsWUFBWSxHQUFHLGNBQWM7QUFBQSxFQUMvQixDQUFDO0FBQ0QsUUFBTSxXQUFXLEtBQUssVUFBVTtBQUFBLElBQzlCLFlBQVksUUFBUTtBQUFBLElBQ3BCLGNBQWMsUUFBUTtBQUFBLEVBQ3hCLENBQUM7QUFDRCxRQUFNLGNBQWMsRUFBRSxRQUFRLElBQUk7QUFDbEMsU0FBTyxJQUFJLFNBQVMsVUFBVSxXQUFXO0FBQzNDO0FBR08sSUFBTSxTQUFTO0FBQUEsRUFDcEIsTUFBTTtBQUNSOyIsCiAgIm5hbWVzIjogW10KfQo=
