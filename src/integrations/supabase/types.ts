export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      artworks: {
        Row: {
          bookpi_hash: string | null
          created_at: string | null
          description: string | null
          edition_number: number | null
          edition_total: number | null
          gallery_id: string | null
          id: string
          is_auction: boolean | null
          is_for_sale: boolean | null
          media_url: string
          price_msr: number | null
          thumbnail_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          bookpi_hash?: string | null
          created_at?: string | null
          description?: string | null
          edition_number?: number | null
          edition_total?: number | null
          gallery_id?: string | null
          id?: string
          is_auction?: boolean | null
          is_for_sale?: boolean | null
          media_url: string
          price_msr?: number | null
          thumbnail_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          bookpi_hash?: string | null
          created_at?: string | null
          description?: string | null
          edition_number?: number | null
          edition_total?: number | null
          gallery_id?: string | null
          id?: string
          is_auction?: boolean | null
          is_for_sale?: boolean | null
          media_url?: string
          price_msr?: number | null
          thumbnail_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artworks_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          artwork_id: string
          bid_count: number | null
          created_at: string | null
          current_price_msr: number
          ends_at: string
          highest_bidder_id: string | null
          id: string
          is_active: boolean | null
          reserve_price_msr: number | null
          seller_id: string
          starting_price_msr: number
          starts_at: string | null
        }
        Insert: {
          artwork_id: string
          bid_count?: number | null
          created_at?: string | null
          current_price_msr: number
          ends_at: string
          highest_bidder_id?: string | null
          id?: string
          is_active?: boolean | null
          reserve_price_msr?: number | null
          seller_id: string
          starting_price_msr: number
          starts_at?: string | null
        }
        Update: {
          artwork_id?: string
          bid_count?: number | null
          created_at?: string | null
          current_price_msr?: number
          ends_at?: string
          highest_bidder_id?: string | null
          id?: string
          is_active?: boolean | null
          reserve_price_msr?: number | null
          seller_id?: string
          starting_price_msr?: number
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          amount_msr: number
          auction_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          amount_msr: number
          auction_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amount_msr?: number
          auction_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      bookpi_ledger: {
        Row: {
          action: string
          actor_id: string | null
          block_number: number | null
          data_hash: string
          entity_id: string
          entity_type: string
          id: string
          merkle_root: string | null
          prev_hash: string | null
          signature: string | null
          timestamp: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          block_number?: number | null
          data_hash: string
          entity_id: string
          entity_type: string
          id?: string
          merkle_root?: string | null
          prev_hash?: string | null
          signature?: string | null
          timestamp?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          block_number?: number | null
          data_hash?: string
          entity_id?: string
          entity_type?: string
          id?: string
          merkle_root?: string | null
          prev_hash?: string | null
          signature?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      channel_members: {
        Row: {
          channel_id: string
          id: string
          joined_at: string | null
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_members_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          avatar_url: string | null
          channel_type: Database["public"]["Enums"]["channel_type"] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          member_count: number | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          channel_type?: Database["public"]["Enums"]["channel_type"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          member_count?: number | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          channel_type?: Database["public"]["Enums"]["channel_type"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          member_count?: number | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          like_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          enrollment_count: number | null
          id: string
          instructor_id: string
          is_free: boolean | null
          is_published: boolean | null
          level: string | null
          price_msr: number | null
          rating: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id: string
          is_free?: boolean | null
          is_published?: boolean | null
          level?: string | null
          price_msr?: number | null
          rating?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id?: string
          is_free?: boolean | null
          is_published?: boolean | null
          level?: string | null
          price_msr?: number | null
          rating?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          completed_lessons: string[] | null
          course_id: string
          enrolled_at: string | null
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_lessons?: string[] | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_lessons?: string[] | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      galleries: {
        Row: {
          artwork_count: number | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          user_id: string
        }
        Insert: {
          artwork_count?: number | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          user_id: string
        }
        Update: {
          artwork_count?: number | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_posts: {
        Row: {
          comment_count: number | null
          content: string
          created_at: string | null
          group_id: string
          id: string
          is_approved: boolean | null
          is_pinned: boolean | null
          like_count: number | null
          media_type: string | null
          media_urls: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_count?: number | null
          content: string
          created_at?: string | null
          group_id: string
          id?: string
          is_approved?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          media_type?: string | null
          media_urls?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_count?: number | null
          content?: string
          created_at?: string | null
          group_id?: string
          id?: string
          is_approved?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          media_type?: string | null
          media_urls?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          avatar_url: string | null
          category: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          is_verified: boolean | null
          member_count: number | null
          name: string
          owner_id: string
          post_count: number | null
          rules: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          member_count?: number | null
          name: string
          owner_id: string
          post_count?: number | null
          rules?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          member_count?: number | null
          name?: string
          owner_id?: string
          post_count?: number | null
          rules?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hashtags: {
        Row: {
          created_at: string | null
          id: string
          post_count: number | null
          tag: string
          trend_score: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_count?: number | null
          tag: string
          trend_score?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_count?: number | null
          tag?: string
          trend_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      isabella_conversations: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      isabella_events: {
        Row: {
          aign_score: number | null
          content: string | null
          conversation_id: string
          created_at: string | null
          ethical_state: string | null
          event_type: string
          governance_flag: string | null
          guardian_user_id: string | null
          hitl_required: boolean | null
          id: string
          is_creator: boolean | null
          layer: string
          meta: Json | null
          risk_level: string | null
          role: string
          session_id: string
        }
        Insert: {
          aign_score?: number | null
          content?: string | null
          conversation_id: string
          created_at?: string | null
          ethical_state?: string | null
          event_type: string
          governance_flag?: string | null
          guardian_user_id?: string | null
          hitl_required?: boolean | null
          id?: string
          is_creator?: boolean | null
          layer: string
          meta?: Json | null
          risk_level?: string | null
          role: string
          session_id: string
        }
        Update: {
          aign_score?: number | null
          content?: string | null
          conversation_id?: string
          created_at?: string | null
          ethical_state?: string | null
          event_type?: string
          governance_flag?: string | null
          guardian_user_id?: string | null
          hitl_required?: boolean | null
          id?: string
          is_creator?: boolean | null
          layer?: string
          meta?: Json | null
          risk_level?: string | null
          role?: string
          session_id?: string
        }
        Relationships: []
      }
      isabella_messages: {
        Row: {
          audio_url: string | null
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "isabella_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "isabella_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_bridges: {
        Row: {
          connection_type: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          from_concept: string
          id: string
          title: string
          to_concept: string
          upvotes: number | null
        }
        Insert: {
          connection_type?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          from_concept: string
          id?: string
          title: string
          to_concept: string
          upvotes?: number | null
        }
        Update: {
          connection_type?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          from_concept?: string
          id?: string
          title?: string
          to_concept?: string
          upvotes?: number | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_free_preview: boolean | null
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean | null
          order_index: number
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean | null
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel_id: string
          content: string | null
          created_at: string | null
          id: string
          is_edited: boolean | null
          media_urls: string[] | null
          read_by: string[] | null
          reply_to_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          media_urls?: string[] | null
          read_by?: string[] | null
          reply_to_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          media_urls?: string[] | null
          read_by?: string[] | null
          reply_to_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      music_library: {
        Row: {
          album: string | null
          artist: string | null
          audio_url: string
          bookpi_hash: string | null
          cover_url: string | null
          created_at: string | null
          duration_seconds: number | null
          genre: string | null
          id: string
          is_original: boolean | null
          is_public: boolean | null
          license: string | null
          title: string
          use_count: number | null
          user_id: string | null
        }
        Insert: {
          album?: string | null
          artist?: string | null
          audio_url: string
          bookpi_hash?: string | null
          cover_url?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          genre?: string | null
          id?: string
          is_original?: boolean | null
          is_public?: boolean | null
          license?: string | null
          title: string
          use_count?: number | null
          user_id?: string | null
        }
        Update: {
          album?: string | null
          artist?: string | null
          audio_url?: string
          bookpi_hash?: string | null
          cover_url?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          genre?: string | null
          id?: string
          is_original?: boolean | null
          is_public?: boolean | null
          license?: string | null
          title?: string
          use_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          bookpi_hash: string | null
          comment_count: number | null
          content: string | null
          content_type: Database["public"]["Enums"]["content_type"] | null
          created_at: string | null
          hashtags: string[] | null
          id: string
          is_pinned: boolean | null
          is_reel: boolean | null
          is_stream: boolean | null
          like_count: number | null
          media_urls: string[] | null
          mentions: string[] | null
          parent_post_id: string | null
          share_count: number | null
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          bookpi_hash?: string | null
          comment_count?: number | null
          content?: string | null
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          is_pinned?: boolean | null
          is_reel?: boolean | null
          is_stream?: boolean | null
          like_count?: number | null
          media_urls?: string[] | null
          mentions?: string[] | null
          parent_post_id?: string | null
          share_count?: number | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          bookpi_hash?: string | null
          comment_count?: number | null
          content?: string | null
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          is_pinned?: boolean | null
          is_reel?: boolean | null
          is_stream?: boolean | null
          like_count?: number | null
          media_urls?: string[] | null
          mentions?: string[] | null
          parent_post_id?: string | null
          share_count?: number | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          birthdate: string | null
          created_at: string | null
          display_name: string
          follower_count: number | null
          following_count: number | null
          id: string
          is_public: boolean | null
          location: string | null
          nvida_hash: string | null
          post_count: number | null
          updated_at: string | null
          user_id: string
          username: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          birthdate?: string | null
          created_at?: string | null
          display_name: string
          follower_count?: number | null
          following_count?: number | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          nvida_hash?: string | null
          post_count?: number | null
          updated_at?: string | null
          user_id: string
          username: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          birthdate?: string | null
          created_at?: string | null
          display_name?: string
          follower_count?: number | null
          following_count?: number | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          nvida_hash?: string | null
          post_count?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website?: string | null
        }
        Relationships: []
      }
      reels: {
        Row: {
          bookpi_hash: string | null
          caption: string | null
          comment_count: number | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          is_featured: boolean | null
          is_public: boolean | null
          like_count: number | null
          music_title: string | null
          music_url: string | null
          share_count: number | null
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          bookpi_hash?: string | null
          caption?: string | null
          comment_count?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          like_count?: number | null
          music_title?: string | null
          music_url?: string | null
          share_count?: number | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          bookpi_hash?: string | null
          caption?: string | null
          comment_count?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          like_count?: number | null
          music_title?: string | null
          music_url?: string | null
          share_count?: number | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: []
      }
      streams: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          ended_at: string | null
          id: string
          is_monetized: boolean | null
          peak_viewers: number | null
          started_at: string | null
          status: string | null
          stream_key: string | null
          stream_url: string | null
          thumbnail_url: string | null
          tips_msr: number | null
          title: string
          user_id: string
          viewer_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_monetized?: boolean | null
          peak_viewers?: number | null
          started_at?: string | null
          status?: string | null
          stream_key?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          tips_msr?: number | null
          title: string
          user_id: string
          viewer_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_monetized?: boolean | null
          peak_viewers?: number | null
          started_at?: string | null
          status?: string | null
          stream_key?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          tips_msr?: number | null
          title?: string
          user_id?: string
          viewer_count?: number | null
        }
        Relationships: []
      }
      team_info: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_order: number | null
          email: string | null
          id: string
          is_founder: boolean | null
          linkedin_url: string | null
          name: string
          role: string
          twitter_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_founder?: boolean | null
          linkedin_url?: string | null
          name: string
          role: string
          twitter_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_founder?: boolean | null
          linkedin_url?: string | null
          name?: string
          role?: string
          twitter_url?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          is_founder: boolean | null
          linkedin_url: string | null
          name: string
          order_index: number | null
          photo_url: string | null
          title: string
          twitter_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_founder?: boolean | null
          linkedin_url?: string | null
          name: string
          order_index?: number | null
          photo_url?: string | null
          title: string
          twitter_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_founder?: boolean | null
          linkedin_url?: string | null
          name?: string
          order_index?: number | null
          photo_url?: string | null
          title?: string
          twitter_url?: string | null
        }
        Relationships: []
      }
      tips: {
        Row: {
          amount_msr: number
          created_at: string | null
          entity_id: string
          entity_type: string
          from_user_id: string
          id: string
          is_anonymous: boolean | null
          message: string | null
          to_user_id: string
        }
        Insert: {
          amount_msr: number
          created_at?: string | null
          entity_id: string
          entity_type: string
          from_user_id: string
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          to_user_id: string
        }
        Update: {
          amount_msr?: number
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          from_user_id?: string
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          to_user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_msr: number
          blockchain_hash: string | null
          bookpi_hash: string
          created_at: string | null
          description: string | null
          from_user_id: string | null
          id: string
          reference_id: string | null
          to_user_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount_msr: number
          blockchain_hash?: string | null
          bookpi_hash: string
          created_at?: string | null
          description?: string | null
          from_user_id?: string | null
          id?: string
          reference_id?: string | null
          to_user_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount_msr?: number
          blockchain_hash?: string | null
          bookpi_hash?: string
          created_at?: string | null
          description?: string | null
          from_user_id?: string | null
          id?: string
          reference_id?: string | null
          to_user_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: []
      }
      trending_topics: {
        Row: {
          category: string | null
          created_at: string | null
          expires_at: string | null
          hashtag_id: string | null
          id: string
          rank: number | null
          region: string | null
          score: number | null
          topic: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          expires_at?: string | null
          hashtag_id?: string | null
          id?: string
          rank?: number | null
          region?: string | null
          score?: number | null
          topic?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          expires_at?: string | null
          hashtag_id?: string | null
          id?: string
          rank?: number | null
          region?: string | null
          score?: number | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trending_topics_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance_msr: number | null
          created_at: string | null
          id: string
          locked_msr: number | null
          total_earned_msr: number | null
          total_spent_msr: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance_msr?: number | null
          created_at?: string | null
          id?: string
          locked_msr?: number | null
          total_earned_msr?: number | null
          total_spent_msr?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance_msr?: number | null
          created_at?: string | null
          id?: string
          locked_msr?: number | null
          total_earned_msr?: number | null
          total_spent_msr?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_stream_key: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      register_bookpi_event: {
        Args: {
          p_action: string
          p_actor_id: string
          p_data?: Json
          p_entity_id: string
          p_entity_type: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "user" | "creator" | "moderator" | "admin" | "guardian"
      channel_type: "public" | "private" | "group" | "broadcast"
      content_type:
        | "text"
        | "image"
        | "video"
        | "audio"
        | "music"
        | "reel"
        | "stream"
        | "artwork"
        | "document"
      transaction_type:
        | "msr_transfer"
        | "auction_bid"
        | "subscription"
        | "donation"
        | "reward"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "creator", "moderator", "admin", "guardian"],
      channel_type: ["public", "private", "group", "broadcast"],
      content_type: [
        "text",
        "image",
        "video",
        "audio",
        "music",
        "reel",
        "stream",
        "artwork",
        "document",
      ],
      transaction_type: [
        "msr_transfer",
        "auction_bid",
        "subscription",
        "donation",
        "reward",
      ],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
