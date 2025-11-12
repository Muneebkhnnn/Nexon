import { clerkClient } from "@clerk/express";

// middleware to check userId and hasPremium

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth(); //returns authentication data.
    const hasPremiumPlan = await has({ plan: "Premium" });

    const user=await clerkClient.users.getUser(userId) //fetches the full user object from Clerk's database (not just session).
    //You get access to publicMetadata and privateMetadata
    // publicmetadata is visible to client and server
    //privatemetadata is only visible to server.

    //if the user has free_usage metadata and is not premium, attach it to req object.
    if(!hasPremiumPlan && user.privateMetadata.free_usage){
        req.free_usage=user.privateMetadata.free_usage//If user is not premium, they track how many free requests they have left.
        //Then attach it to req so other routes can use it.
    }
    // else if user is not premium and has no free_usage metadata, initialize it to 0.
    else{
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: { free_usage: 0 },
          });
        req.free_usage=0
    }

    req.plan=hasPremiumPlan?'Premium':'Free'
    next();
  } catch (error) {
    res.json({success:false,message:error.message})
  }
};

/* User hits API route →
Middleware runs →
• If no session → unauthorized
• If free user → decrement/check free usage
• If premium user → skip limits
→ Next middleware/route runs
 */
