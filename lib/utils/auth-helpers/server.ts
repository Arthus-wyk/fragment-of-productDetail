'use server';


import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL, getErrorRedirect, getStatusRedirect } from '../helpers';
import { getAuthTypes } from './settings';
import { createClient } from '../supabase/server';
import { supabase as supabaseClient } from '@/lib/utils/supabase/client';



function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(
      '/account',
      'Hmm... Something went wrong.',
      'You could not be signed out.'
    );
  }

  return '/';
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = cookies();
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'Invalid email address.',
      'Please try again.'
    );
  }


  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true
  };
  const supabase = createClient();
  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  // if (allowPassword) options.shouldCreateUser = false;
  console.log("go to signInWithOtp")
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options
  });
  console.log("===data:",data,error);

  if (error?.message=="") {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'You could not be signed in.',
      error.message
    );
  } 
   else if (data) {
    cookieStore.set('preferredSignInView', 'email_signin', { path: '/' });
    redirectPath = getStatusRedirect(
      '/signin/email_signin',
      'Success!',
      'Please check your email for a magic link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
  }

  return redirectPath;
}

export async function requestPasswordUpdate(formData: FormData) {
  const callbackURL = getURL('/auth/reset_password');

  // Get form data
  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      'Invalid email address.',
      'Please try again.'
    );
  }


  const supabase = createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL
  });
  console.log(error)

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      error.message,
      'Please try again.'
    );
  } else if (data) {
    redirectPath = getStatusRedirect(
      '/signin/forgot_password',
      'Success!',
      'Please check your email for a password reset link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      'Hmm... Something went wrong.',
      'Password reset email could not be sent.'
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = cookies();
  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;
  const supabase = createClient();
  console.log(email,password)
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.log('Sign in failed')
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Sign in failed.',
      error.message
    );
  } else if (data.user && data.session) {
    // 存储令牌在 HTTP-only cookies 中
    cookieStore.set('access_token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7天
    });
    
    cookieStore.set('refresh_token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30 // 30天
    });

    cookieStore.set('preferredSignInView', 'password_signin', { path: '/' });
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
  }



  return redirectPath;
}

export async function signUp(formData: FormData,retries = 3) {
  const callbackURL = getURL('/auth/callback');
  const supabase = createClient();
  const name = String(formData.get('name')).trim();
  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Invalid email address.',
      'Please try again.'
    );
  }

  console.log(name,email,password)




    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: callbackURL,
        data: {
          full_name:name, // 传递用户名到 user_metadata
        }
      }
    });
    console.log("signUp data:",data)
    if (error) {
      // if(error.code==='504',retries >0){
      //   console.warn('Request timed out. Retrying...');
      //   return signUp(formData, retries - 1);  // 重试
      // }
      redirectPath = getErrorRedirect(
        '/signin/signup',
        'Sign up failed.',
        error.message
      );
    }else if (
      data.user &&
      data.user.identities &&
      data.user.identities.length == 0
    ) {
      redirectPath = getErrorRedirect(
        '/signin/signup',
        'Sign up failed.',
        'There is already an account associated with this email address. Try resetting your password.'
      );
    }
    else if (data.user) {
      console.log("data.user",data.user)
      const body={
        username:data.user.id,
        password:password,
        password2:password,
        email:'',
        verification_code:"",
        aff_code: null
      }
      const result = await sendTokenRequest(body)
      console.log("result message",result.data)
      if(!result.success){
        redirectPath = getErrorRedirect(
          '/signin/signup',
          'Sign in failed.',
          result.message
        );
      }
      else{
        const newApiUserID=result.data.user_id;
        const newApiToken=result.data.token;
        const { data:newApi_userData, error:newApi_userError } = await supabaseClient
        .from('newapi_user')
        .insert([{ 
          id:data.user.id,
          accessToken:newApiToken, 
          newApi_user_id:newApiUserID,
          token_key_usedNow:result.data.key,
          free_token:{success:true,message:'',token:result.data.key}
        }])
        .select()
        
        console.log("newApi_userData:",newApi_userData)
        if(newApi_userError){
          console.log("newApi_userError:",newApi_userError.message)
          redirectPath = getErrorRedirect(
            '/signin/signup',
            'Hmm... Something went wrong.',
            newApi_userError.message
          );
        }
        else{
          redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
        }
      }
      
    } else {
      redirectPath = getErrorRedirect(
        '/signin/signup',
        'Hmm... Something went wrong.',
        'You could not be signed up.'
      );
    }
  
  return redirectPath;
}
export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Your password could not be updated.',
      'Passwords do not match.'
    );
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Your password could not be updated.',
      error.message
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Your password has been updated.'
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Hmm... Something went wrong.',
      'Your password could not be updated.'
    );
  }

  return redirectPath;
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get('newEmail')).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      '/account',
      'Your email could not be updated.',
      'Invalid email address.'
    );
  }



  const callbackUrl = getURL(
    getStatusRedirect('/account', 'Success!', `Your email has been updated.`)
  );
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl
    }
  );

  if (error) {
    return getErrorRedirect(
      '/account',
      'Your email could not be updated.',
      error.message
    );
  } else {
    return getStatusRedirect(
      '/account',
      'Confirmation emails sent.',
      `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
    );
  }
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return getErrorRedirect(
      '/account',
      'Your name could not be updated.',
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/account',
      'Success!',
      'Your name has been updated.'
    );
  } else {
    return getErrorRedirect(
      '/account',
      'Hmm... Something went wrong.',
      'Your name could not be updated.'
    );
  }
}


// 发送 POST 请求到 '/api/setToken' 并处理响应
const sendTokenRequest = async (body:any) => {

    const response = await fetch('http://localhost:3000/api/setToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // 解析响应体
    const data = await response.json();

    return data;

  
};

