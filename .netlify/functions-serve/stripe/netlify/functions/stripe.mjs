
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
  path: "/api/stripe"
};
export {
  config,
  handler as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvc3RyaXBlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBjb25zdCBzdHJpcGUgPSByZXF1aXJlKCdzdHJpcGUnKShwcm9jZXNzLmVudi5TVFJJUEVfU0VDUkVUKTtcclxuaW1wb3J0IFN0cmlwZSBmcm9tICdzdHJpcGUnO1xyXG5jb25zdCBzdHJpcGUgPSBuZXcgU3RyaXBlKHByb2Nlc3MuZW52LlNUUklQRV9TRUNSRVQpO1xyXG4vLyBjb25zdCBjdXJyZW50SG9zdFVybCA9ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgnOy8vZGV2IHdpdGggbmV0bGlmeSBjbGlcclxuY29uc3QgY3VycmVudEhvc3RVcmwgPSAnaHR0cHM6Ly93aWxkLW9hc2lzLWRlbW8ubmV0bGlmeS5hcHAnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIGNvbnRleHQpIHtcclxuICBjb25zdCByZXFCb2R5ID0gYXdhaXQgcmVxLmpzb24oKTtcclxuICAvLyBjb25zb2xlLmxvZyhgcmVxdWVzdCBib2R5IC0gJHtKU09OLnN0cmluZ2lmeShyZXFCb2R5KX1gKTtcclxuICBjb25zdCB7IHByb2R1Y3QsIGNvc3QgfSA9IHJlcUJvZHk7XHJcbiAgY29uc29sZS5sb2coYGNhYmluTmFtZSBmcm9tIHN0cmlwZSAtICR7cHJvZHVjdH1gKTtcclxuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgc3RyaXBlLmNoZWNrb3V0LnNlc3Npb25zLmNyZWF0ZSh7XHJcbiAgICBsaW5lX2l0ZW1zOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBwcmljZV9kYXRhOiB7XHJcbiAgICAgICAgICBjdXJyZW5jeTogJ2dicCcsXHJcbiAgICAgICAgICBwcm9kdWN0X2RhdGE6IHtcclxuICAgICAgICAgICAgbmFtZTogJ1lvdXIgc3RheSBhdCBvdXIgY2FiaW4gY2FsbGVkICcgKyBkZWNvZGVVUkkocHJvZHVjdCksXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdW5pdF9hbW91bnQ6IE1hdGguZmxvb3IoY29zdCAqIDEwMCksXHJcbiAgICAgICAgfSxcclxuICAgICAgICBxdWFudGl0eTogMSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBtb2RlOiAncGF5bWVudCcsXHJcbiAgICB1aV9tb2RlOiAnZW1iZWRkZWQnLFxyXG4gICAgcmV0dXJuX3VybDogYCR7Y3VycmVudEhvc3RVcmx9L3N1Y2Nlc3NmdWwtcGF5bWVudC97Q0hFQ0tPVVRfU0VTU0lPTl9JRH1gLFxyXG4gIH0pO1xyXG4gIGNvbnN0IHJlc19ib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgc2Vzc2lvbl9pZDogc2Vzc2lvbi5pZCxcclxuICAgIGNsaWVudFNlY3JldDogc2Vzc2lvbi5jbGllbnRfc2VjcmV0LFxyXG4gIH0pO1xyXG4gIGNvbnN0IHJlc19vcHRpb25zID0geyBzdGF0dXM6IDIwMCB9O1xyXG4gIHJldHVybiBuZXcgUmVzcG9uc2UocmVzX2JvZHksIHJlc19vcHRpb25zKTtcclxufVxyXG5cclxuLy9UaGlzIHNldHMgdGhlIHBhdGggdGhhdCB5b3UgdXNlIGluIHlvdXIgZmV0Y2ggcmVxdWVzdCAtIHNlZSB0aGUgQ2hlY2tvdXQgZm9yIGFuIGV4YW1wbGVcclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcclxuICBwYXRoOiAnL2FwaS9zdHJpcGUnLFxyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7O0FBQ0EsT0FBTyxZQUFZO0FBQ25CLElBQU0sU0FBUyxJQUFJLE9BQU8sUUFBUSxJQUFJLGFBQWE7QUFFbkQsSUFBTSxpQkFBaUI7QUFFdkIsZUFBTyxRQUErQixLQUFLLFNBQVM7QUFDbEQsUUFBTSxVQUFVLE1BQU0sSUFBSSxLQUFLO0FBRS9CLFFBQU0sRUFBRSxTQUFTLEtBQUssSUFBSTtBQUMxQixVQUFRLElBQUksMkJBQTJCLE9BQU8sRUFBRTtBQUNoRCxRQUFNLFVBQVUsTUFBTSxPQUFPLFNBQVMsU0FBUyxPQUFPO0FBQUEsSUFDcEQsWUFBWTtBQUFBLE1BQ1Y7QUFBQSxRQUNFLFlBQVk7QUFBQSxVQUNWLFVBQVU7QUFBQSxVQUNWLGNBQWM7QUFBQSxZQUNaLE1BQU0sbUNBQW1DLFVBQVUsT0FBTztBQUFBLFVBQzVEO0FBQUEsVUFDQSxhQUFhLEtBQUssTUFBTSxPQUFPLEdBQUc7QUFBQSxRQUNwQztBQUFBLFFBQ0EsVUFBVTtBQUFBLE1BQ1o7QUFBQSxJQUNGO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFDVCxZQUFZLEdBQUcsY0FBYztBQUFBLEVBQy9CLENBQUM7QUFDRCxRQUFNLFdBQVcsS0FBSyxVQUFVO0FBQUEsSUFDOUIsWUFBWSxRQUFRO0FBQUEsSUFDcEIsY0FBYyxRQUFRO0FBQUEsRUFDeEIsQ0FBQztBQUNELFFBQU0sY0FBYyxFQUFFLFFBQVEsSUFBSTtBQUNsQyxTQUFPLElBQUksU0FBUyxVQUFVLFdBQVc7QUFDM0M7QUFHTyxJQUFNLFNBQVM7QUFBQSxFQUNwQixNQUFNO0FBQ1I7IiwKICAibmFtZXMiOiBbXQp9Cg==
