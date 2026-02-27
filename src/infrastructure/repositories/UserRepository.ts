/**
 * UserRepository — maps raw API response → User domain entity.
 * path: src/infrastructure/repositories/UserRepository.ts
 *
 * getCurrentUser() calls /user with no query params.
 * The backend identifies the user from the Bearer token in the header.
 * httpClient attaches the token automatically via its request interceptor.
 */
import {IUserRepository} from '../../domain/repositories/IUserRepository';
import {User, UserProps} from '../../domain/entities/User';
import {httpClient} from '../network/HttpClient';
import {API_CONFIG} from '../../shared/config/ApiConfig';
import {AppError} from '../../domain/errors/AppError';

interface UserApiResponse {
  error: boolean;
  message: string;
  user: {
    id: string;
    full_name: string;
    bio: string;
    username: string;
    email_address: string;
    phone_number: string | null;
    is_active: boolean;
    is_verified: boolean;
    is_private: boolean;
    role_name: string;
    profile_pic_url: string | null;
    post_count: number;
    latest_posts: Array<{
      id: string; post_name: string;
      post_description: string; post_media_uuid: string; created_date: string;
    }>;
    follower_count: number;
    latest_followers: Array<{
      id: string; username: string; full_name: string; profile_pic_url?: string;
    }>;
    following_count: number;
    latest_following: Array<{
      id: string; username: string; full_name: string; profile_pic_url?: string;
    }>;
    business_account_id: string | null;
    business_name: string | null;
    business_description: string | null;
    business_link: string | null;
    business_account_status: string | null;
    business_account_feature: Array<{
      id: string; feature_name: string;
      feature_description: string; image_url: string;
    }>;
    skill: Array<{id: string; name: string; description: string | null}>;
    subscription_plan_name: string | null;
    created_date: string;
  };
}

function toUserProps(raw: UserApiResponse['user']): UserProps {
  return {
    id:              raw.id,
    full_name:       raw.full_name,
    username:        raw.username,
    email_address:   raw.email_address,
    bio:             raw.bio ?? '',
    phone_number:    raw.phone_number,
    profile_pic_url: raw.profile_pic_url ?? null,
    is_active:       raw.is_active,
    is_verified:     raw.is_verified,
    is_private:      raw.is_private,
    role_name:       raw.role_name,
    post_count:      raw.post_count,
    follower_count:  raw.follower_count,
    following_count: raw.following_count,
    latest_posts:             raw.latest_posts             ?? [],
    latest_followers:         raw.latest_followers         ?? [],
    latest_following:         raw.latest_following         ?? [],
    business_account_id:      raw.business_account_id,
    business_name:            raw.business_name,
    business_description:     raw.business_description,
    business_link:            raw.business_link,
    business_account_status:  raw.business_account_status,
    business_account_feature: raw.business_account_feature ?? [],
    skill:                    raw.skill                    ?? [],
    subscription_plan_name:   raw.subscription_plan_name,
    created_date:             raw.created_date,
  };
}

export class UserRepository implements IUserRepository {
  async getUserById(id: string): Promise<User> {
    const res = await httpClient.get<UserApiResponse>(
      API_CONFIG.ENDPOINTS.USER.GET_BY_ID,
      {params: {id}},
    );
    if (res.error) throw AppError.unknown(res.message);
    return User.create(toUserProps(res.user));
  }

  async getCurrentUser(): Promise<User> {
    // No userId needed — httpClient sends Bearer token automatically.
    // Backend returns the profile for whoever owns the token.
    const res = await httpClient.get<UserApiResponse>(
      API_CONFIG.ENDPOINTS.USER.GET_BY_ID,
      // No params — token-based auth only
    );
    if (res.error) throw AppError.unauthorized(res.message);
    return User.create(toUserProps(res.user));
  }
}