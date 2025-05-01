
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvc3RyaXBlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgU3RyaXBlIGZyb20gJ3N0cmlwZSc7XHJcbmNvbnN0IHN0cmlwZSA9IG5ldyBTdHJpcGUocHJvY2Vzcy5lbnYuU1RSSVBFX1NFQ1JFVCk7XHJcbi8vIGNvbnN0IGN1cnJlbnRIb3N0VXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OCc7Ly9kZXYgd2l0aCBuZXRsaWZ5IGNsaVxyXG5jb25zdCBjdXJyZW50SG9zdFVybCA9ICdodHRwczovL3dpbGQtb2FzaXMtZGVtby5uZXRsaWZ5LmFwcCc7XHJcblxyXG4vL05vdGUgdGhhdCBmb3IgTmV0bGlmeSBpdCBkb2VzIG5vdCBtYXR0ZXIgd2hhdCB5b3UgbmFtZSB5b3VyIGZ1bmN0aW9ucyBhcyBsb25nIGFzIHRoZXkgZm9sbG93IHRoZSBleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBwYXR0ZXJuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCBjb250ZXh0KSB7XHJcbiAgY29uc3QgcmVxQm9keSA9IGF3YWl0IHJlcS5qc29uKCk7XHJcbiAgLy8gY29uc29sZS5sb2coYHJlcXVlc3QgYm9keSAtICR7SlNPTi5zdHJpbmdpZnkocmVxQm9keSl9YCk7XHJcbiAgY29uc3QgeyBwcm9kdWN0LCBjb3N0IH0gPSByZXFCb2R5O1xyXG4gIGNvbnNvbGUubG9nKGBjYWJpbk5hbWUgZnJvbSBzdHJpcGUgLSAke3Byb2R1Y3R9YCk7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHN0cmlwZS5jaGVja291dC5zZXNzaW9ucy5jcmVhdGUoe1xyXG4gICAgbGluZV9pdGVtczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgcHJpY2VfZGF0YToge1xyXG4gICAgICAgICAgY3VycmVuY3k6ICdnYnAnLFxyXG4gICAgICAgICAgcHJvZHVjdF9kYXRhOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdZb3VyIHN0YXkgYXQgb3VyIGNhYmluIGNhbGxlZCAnICsgZGVjb2RlVVJJKHByb2R1Y3QpLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHVuaXRfYW1vdW50OiBNYXRoLmZsb29yKGNvc3QgKiAxMDApLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcXVhbnRpdHk6IDEsXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgbW9kZTogJ3BheW1lbnQnLFxyXG4gICAgdWlfbW9kZTogJ2VtYmVkZGVkJyxcclxuICAgIHJldHVybl91cmw6IGAke2N1cnJlbnRIb3N0VXJsfS9zdWNjZXNzZnVsLXBheW1lbnQ/c2Vzc2lvbl9pZD17Q0hFQ0tPVVRfU0VTU0lPTl9JRH1gLFxyXG4gIH0pO1xyXG4gIGNvbnN0IHJlc19ib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgc2Vzc2lvbl9pZDogc2Vzc2lvbi5pZCxcclxuICAgIGNsaWVudFNlY3JldDogc2Vzc2lvbi5jbGllbnRfc2VjcmV0LFxyXG4gIH0pO1xyXG4gIGNvbnN0IHJlc19vcHRpb25zID0geyBzdGF0dXM6IDIwMCB9O1xyXG4gIHJldHVybiBuZXcgUmVzcG9uc2UocmVzX2JvZHksIHJlc19vcHRpb25zKTtcclxufVxyXG5cclxuLy9UaGlzIHNldHMgdGhlIHBhdGggdGhhdCB5b3UgdXNlIGluIHlvdXIgZmV0Y2ggcmVxdWVzdCAtIHNlZSB0aGUgQ2hlY2tvdXQgZm9yIGFuIGV4YW1wbGVcclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcclxuICBwYXRoOiAnL2FwaS9zdHJpcGUnLFxyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxZQUFZO0FBQ25CLElBQU0sU0FBUyxJQUFJLE9BQU8sUUFBUSxJQUFJLGFBQWE7QUFFbkQsSUFBTSxpQkFBaUI7QUFHdkIsZUFBTyxRQUErQixLQUFLLFNBQVM7QUFDbEQsUUFBTSxVQUFVLE1BQU0sSUFBSSxLQUFLO0FBRS9CLFFBQU0sRUFBRSxTQUFTLEtBQUssSUFBSTtBQUMxQixVQUFRLElBQUksMkJBQTJCLE9BQU8sRUFBRTtBQUNoRCxRQUFNLFVBQVUsTUFBTSxPQUFPLFNBQVMsU0FBUyxPQUFPO0FBQUEsSUFDcEQsWUFBWTtBQUFBLE1BQ1Y7QUFBQSxRQUNFLFlBQVk7QUFBQSxVQUNWLFVBQVU7QUFBQSxVQUNWLGNBQWM7QUFBQSxZQUNaLE1BQU0sbUNBQW1DLFVBQVUsT0FBTztBQUFBLFVBQzVEO0FBQUEsVUFDQSxhQUFhLEtBQUssTUFBTSxPQUFPLEdBQUc7QUFBQSxRQUNwQztBQUFBLFFBQ0EsVUFBVTtBQUFBLE1BQ1o7QUFBQSxJQUNGO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFDVCxZQUFZLEdBQUcsY0FBYztBQUFBLEVBQy9CLENBQUM7QUFDRCxRQUFNLFdBQVcsS0FBSyxVQUFVO0FBQUEsSUFDOUIsWUFBWSxRQUFRO0FBQUEsSUFDcEIsY0FBYyxRQUFRO0FBQUEsRUFDeEIsQ0FBQztBQUNELFFBQU0sY0FBYyxFQUFFLFFBQVEsSUFBSTtBQUNsQyxTQUFPLElBQUksU0FBUyxVQUFVLFdBQVc7QUFDM0M7QUFHTyxJQUFNLFNBQVM7QUFBQSxFQUNwQixNQUFNO0FBQ1I7IiwKICAibmFtZXMiOiBbXQp9Cg==
