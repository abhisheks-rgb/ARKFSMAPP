/**
 * User — domain entity.
 * path: src/domain/entities/User.ts
 */

export interface Post {
  id: string;
  post_name: string;
  post_description: string;
  post_media_uuid: string;
  created_date: string;
}

export interface Follower {
  id: string;
  username: string;
  full_name: string;
  profile_pic_url?: string;
}

export interface BusinessFeature {
  id: string;
  feature_name: string;
  feature_description: string;
  image_url: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
}

export interface UserProps {
  id: string;
  full_name: string;
  username: string;
  email_address: string;
  bio: string;
  phone_number: string | null;
  profile_pic_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_private: boolean;
  role_name: string;

  post_count: number;
  follower_count: number;
  following_count: number;
  latest_posts: Post[];
  latest_followers: Follower[];
  latest_following: Follower[];

  business_account_id: string | null;
  business_name: string | null;
  business_description: string | null;
  business_link: string | null;
  business_account_status: string | null;
  business_account_feature: BusinessFeature[];

  skill: Skill[];
  subscription_plan_name: string | null;
  created_date: string;
}

export class User {
  constructor(public readonly props: UserProps) {}

  get id()          { return this.props.id; }
  get fullName()    { return this.props.full_name?.trim() ?? ''; }
  get username()    { return this.props.username; }
  get email()       { return this.props.email_address; }
  get bio()         { return this.props.bio; }
  get avatarUrl()   { return this.props.profile_pic_url; }
  get isVerified()  { return this.props.is_verified; }
  get isPrivate()   { return this.props.is_private; }
  get hasBusiness() { return !!this.props.business_account_id; }
  get displayName() { return this.fullName || `@${this.username}`; }

  static create(props: UserProps): User {
    return new User(props);
  }
}