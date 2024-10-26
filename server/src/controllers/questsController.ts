import { Request, Response } from 'express';
import Twitter from 'twitter-lite';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { getUserByEmail } from '../services/userServices';
import UserQuests from '../models/userQuests';
import Quests from '../models/Quests';
import axios from 'axios';

/**
 * NOT WORKING.
 * @param req 
 * @param res 
 * @returns 
 */
export const checkTwitter = async (req: Request, res: Response) => {
  try {

    const { id } = req.body;

    // Initialize Twitter client with app credentials.
    const consumerKey = process.env.TWITTER_API_KEY;
    const consumerSecret = process.env.TWITTER_API_SECRET;
    const accessTokenKey = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

    if (!consumerKey || !consumerSecret || !accessTokenKey || !accessTokenSecret) {
    // throw new Error('Twitter API credentials are missing');
    console.error("Twitter API credentials are missing");
     return res.status(500).json({ message: 'Internal Server Error' });
    }

    const client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token_key: accessTokenKey,
        access_token_secret: accessTokenSecret,
    });

    // Fetch the user's last tweets
    // const tweets = await client.get("statuses/user_timeline", {
    //   user_id: id, // Assuming you want to fetch tweets by user ID
    //   count: 5, // Fetch last 5 tweets (you can adjust this)
    // });

    //demo
    const tweets = await client.get("statuses/user_timeline",{
        user_id : 1773876428020301824,
        count: 1
    });

    console.log(tweets);

    if(tweets.length > 0){
        //check if tweet contains a keyword from the tweet.
        
        // Define keywords to search for in tweets.
        // Ideally. we will load all the quests and iterate to see which quest the user just completed.
        const keywords = ['alpharand', 'alpharandAce'];

        // Check each tweet for the keywords
        const tweetsWithKeywords = tweets.filter((tweet: any) =>
        keywords.some(keyword => tweet.text.includes(keyword))
        );

        if (tweetsWithKeywords.length > 0) {
        //@TODO: update db.
        res.status(200).json({ message: 'Tweets containing keywords found', tweets: tweetsWithKeywords });
        } else {
        res.status(200).json({ message: 'Required tweet not found' });
        }

    }
    res.status(200).json({ message: 'Quest not completed.' });
    
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


/**
 * NOT WORKING!!!
 * @param req 
 * @param res 
 */
export const twitterHandle = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('apikey: '+process.env.TWITTER_API_KEY);
    console.log('apisecret: '+process.env.TWITTER_API_SECRET);
    
    passport.use(
      new TwitterStrategy(
        {
          consumerKey: process.env.TWITTER_API_KEY || '',
          consumerSecret: process.env.TWITTER_API_SECRET || '',
          callbackURL: 'http://miniapp.alpharand.io/oauth/callback/twitter',
        },
        async (token: string, tokenSecret: string, profile: any, done: Function) => {
          try {
            console.log(profile);
            done(null, profile);
          } catch (err) {
            done(err);
          }
        }
      )
    );

    const user = await new Promise((resolve, reject) => {
      passport.authenticate('twitter', (err : any, user : any, info : any) => {
        if (err) {
          return reject(err);
        }
        if (!user) {
          return reject(new Error('Unauthorized'));
        }
        resolve(user);
      })(req, res);
    });

    res.status(200).json({ message: 'Authenticated', user });
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message || '500. Internal server error' });
    } else {
      res.status(500).json({ message: '500. Internal server error' });
    }
  }
};

export const questUrl = async (req: Request, res: Response) => {
  try {
    const env_url = "https://airdrop.alpharand.io";
    const apiKey = process.env.AIRDROP_APP_API_KEY;
    
    if (!apiKey) {
      console.error("Missing Airdrop APP API Key");
      return res.status(500).json({ message: 'Internal server error' });
    }

    const response = await axios.get(`${env_url}/api/twitter`, {
      params: {
        api_key: apiKey,
      },
    });

    const result = response.data;
    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const questHandleCallback = async(req: Request, res: Response) =>{
  const {email, task} = req.body;

  const authHeader = req.headers.authorization;

  // Check if the authorization header exists and starts with 'Bearer'
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract the token from the header
    const token = authHeader.split(' ')[1];
    console.log('Bearer Token:', token);
    if(token!==process.env.AIRDROP_APP_API_KEY){
      return res.status(401).json({message: "Unauthorized"});
    }
  } else {
    console.error('Authorization header is missing or invalid');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  
  if(!email || !task){
    res.status(404).json({message : "Some keys are missing in Request."});
  }
  else{
    //look for user with the email.
    const user = await getUserByEmail(email);
    if(!user){
      res.status(404).json({message: "User not found"})
    }
    else{
      //we now have the user.
      //check if user has already completed action.
      const user_quest = await UserQuests.findOne({ where: { 
        user: user.id,
        quest: task
       } });
       if(user_quest){
        //it has already been completed.
        res.status(200).json({message: "Quest already completed."});
       }
       else{

        const tquest = await Quests.findByPk(task);

        if(!tquest){
          res.status(404).json({message: "Quest not found"});
        }
        else{
          //update user and userQuests.
          user.farmedPoints += tquest.point;
          await user.save();

          //userQuests.
          await UserQuests.create({
            user: user.id,
            quest: tquest.id,
            status: 1
          });
          res.status(200).json({message: "Quest completed"});
        }
       }
    }
  }
  
}