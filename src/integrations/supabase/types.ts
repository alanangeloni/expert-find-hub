export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounting_firm_industries: {
        Row: {
          created_at: string | null
          firm_id: string
          id: string
          industry: string
        }
        Insert: {
          created_at?: string | null
          firm_id: string
          id?: string
          industry: string
        }
        Update: {
          created_at?: string | null
          firm_id?: string
          id?: string
          industry?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounting_firm_industries_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "accounting_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      accounting_firm_services: {
        Row: {
          created_at: string | null
          firm_id: string
          id: string
          service: Database["public"]["Enums"]["accounting_service_type"]
        }
        Insert: {
          created_at?: string | null
          firm_id: string
          id?: string
          service: Database["public"]["Enums"]["accounting_service_type"]
        }
        Update: {
          created_at?: string | null
          firm_id?: string
          id?: string
          service?: Database["public"]["Enums"]["accounting_service_type"]
        }
        Relationships: [
          {
            foreignKeyName: "accounting_firm_services_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "accounting_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      accounting_firm_specialties: {
        Row: {
          created_at: string | null
          firm_id: string
          id: string
          specialty: Database["public"]["Enums"]["client_specialty_type"]
        }
        Insert: {
          created_at?: string | null
          firm_id: string
          id?: string
          specialty: Database["public"]["Enums"]["client_specialty_type"]
        }
        Update: {
          created_at?: string | null
          firm_id?: string
          id?: string
          specialty?: Database["public"]["Enums"]["client_specialty_type"]
        }
        Relationships: [
          {
            foreignKeyName: "accounting_firm_specialties_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "accounting_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      accounting_firms: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          employees: string | null
          established: string | null
          headquarters: string | null
          id: string
          large_image_url: string | null
          logo_url: string | null
          long_description: string | null
          minimum_fee: string | null
          name: string
          premium: boolean | null
          rating: number | null
          review_count: number | null
          slug: string
          small_image_url: string | null
          updated_at: string | null
          verified: boolean | null
          video_title: string | null
          video_url: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          employees?: string | null
          established?: string | null
          headquarters?: string | null
          id?: string
          large_image_url?: string | null
          logo_url?: string | null
          long_description?: string | null
          minimum_fee?: string | null
          name: string
          premium?: boolean | null
          rating?: number | null
          review_count?: number | null
          slug: string
          small_image_url?: string | null
          updated_at?: string | null
          verified?: boolean | null
          video_title?: string | null
          video_url?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          employees?: string | null
          established?: string | null
          headquarters?: string | null
          id?: string
          large_image_url?: string | null
          logo_url?: string | null
          long_description?: string | null
          minimum_fee?: string | null
          name?: string
          premium?: boolean | null
          rating?: number | null
          review_count?: number | null
          slug?: string
          small_image_url?: string | null
          updated_at?: string | null
          verified?: boolean | null
          video_title?: string | null
          video_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      advisor_carousel_images: {
        Row: {
          advisor_id: string
          created_at: string | null
          id: string
          image_url: string
        }
        Insert: {
          advisor_id: string
          created_at?: string | null
          id?: string
          image_url: string
        }
        Update: {
          advisor_id?: string
          created_at?: string | null
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_carousel_images_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "financial_advisors"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_clientele: {
        Row: {
          advisor_id: string
          clientele_type: Database["public"]["Enums"]["clientele_type"]
          created_at: string | null
          id: string
        }
        Insert: {
          advisor_id: string
          clientele_type: Database["public"]["Enums"]["clientele_type"]
          created_at?: string | null
          id?: string
        }
        Update: {
          advisor_id?: string
          clientele_type?: Database["public"]["Enums"]["clientele_type"]
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_clientele_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "financial_advisors"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_compensation_types: {
        Row: {
          advisor_id: string
          compensation_type: Database["public"]["Enums"]["compensation_type"]
          created_at: string | null
          id: string
        }
        Insert: {
          advisor_id: string
          compensation_type: Database["public"]["Enums"]["compensation_type"]
          created_at?: string | null
          id?: string
        }
        Update: {
          advisor_id?: string
          compensation_type?: Database["public"]["Enums"]["compensation_type"]
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_compensation_types_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "financial_advisors"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_licenses: {
        Row: {
          advisor_id: string
          created_at: string | null
          id: string
          license: string
        }
        Insert: {
          advisor_id: string
          created_at?: string | null
          id?: string
          license: string
        }
        Update: {
          advisor_id?: string
          created_at?: string | null
          id?: string
          license?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_licenses_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "financial_advisors"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_professional_designations: {
        Row: {
          advisor_id: string
          created_at: string | null
          designation: string
          id: string
        }
        Insert: {
          advisor_id: string
          created_at?: string | null
          designation: string
          id?: string
        }
        Update: {
          advisor_id?: string
          created_at?: string | null
          designation?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_professional_designations_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "financial_advisors"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_professions: {
        Row: {
          advisor_id: string
          created_at: string | null
          id: string
          profession_type: Database["public"]["Enums"]["profession_type"]
        }
        Insert: {
          advisor_id: string
          created_at?: string | null
          id?: string
          profession_type: Database["public"]["Enums"]["profession_type"]
        }
        Update: {
          advisor_id?: string
          created_at?: string | null
          id?: string
          profession_type?: Database["public"]["Enums"]["profession_type"]
        }
        Relationships: [
          {
            foreignKeyName: "advisor_professions_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "financial_advisors"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_services: {
        Row: {
          advisor_id: string
          created_at: string | null
          id: string
          service: Database["public"]["Enums"]["service_offered"]
        }
        Insert: {
          advisor_id: string
          created_at?: string | null
          id?: string
          service: Database["public"]["Enums"]["service_offered"]
        }
        Update: {
          advisor_id?: string
          created_at?: string | null
          id?: string
          service?: Database["public"]["Enums"]["service_offered"]
        }
        Relationships: [
          {
            foreignKeyName: "advisor_services_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "financial_advisors"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_states: {
        Row: {
          advisor_id: string
          created_at: string | null
          id: string
          state: string
        }
        Insert: {
          advisor_id: string
          created_at?: string | null
          id?: string
          state: string
        }
        Update: {
          advisor_id?: string
          created_at?: string | null
          id?: string
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_states_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "financial_advisors"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_name: string
          created_at: string | null
          id: string
          post_id: string
        }
        Insert: {
          category_name: string
          created_at?: string | null
          id?: string
          post_id: string
        }
        Update: {
          category_name?: string
          created_at?: string | null
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          blog_category: Database["public"]["Enums"]["blog_category"] | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          blog_category?: Database["public"]["Enums"]["blog_category"] | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          blog_category?: Database["public"]["Enums"]["blog_category"] | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_advisors: {
        Row: {
          advisor_sec_crd: string | null
          calls_booked: number | null
          city: string | null
          created_at: string | null
          email: string | null
          fiduciary: boolean | null
          firm_address: string | null
          firm_aum: string | null
          firm_bio: string | null
          firm_logo_url: string | null
          firm_name: string | null
          firm_sec_crd: string | null
          first_session_is_free: boolean | null
          headshot_url: string | null
          id: string
          link_to_advisor_sec: string | null
          link_to_firm_sec: string | null
          minimum: string | null
          name: string
          personal_bio: string | null
          phone_number: string | null
          position: string | null
          premium: boolean | null
          primary_education: string | null
          rating: number | null
          scheduling_link: string | null
          secondary_education: string | null
          slug: string
          state_hq: string | null
          updated_at: string | null
          username: string | null
          verified: boolean | null
          website_url: string | null
          years_of_experience: number | null
          youtube_video_id: string | null
        }
        Insert: {
          advisor_sec_crd?: string | null
          calls_booked?: number | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          fiduciary?: boolean | null
          firm_address?: string | null
          firm_aum?: string | null
          firm_bio?: string | null
          firm_logo_url?: string | null
          firm_name?: string | null
          firm_sec_crd?: string | null
          first_session_is_free?: boolean | null
          headshot_url?: string | null
          id?: string
          link_to_advisor_sec?: string | null
          link_to_firm_sec?: string | null
          minimum?: string | null
          name: string
          personal_bio?: string | null
          phone_number?: string | null
          position?: string | null
          premium?: boolean | null
          primary_education?: string | null
          rating?: number | null
          scheduling_link?: string | null
          secondary_education?: string | null
          slug: string
          state_hq?: string | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
          website_url?: string | null
          years_of_experience?: number | null
          youtube_video_id?: string | null
        }
        Update: {
          advisor_sec_crd?: string | null
          calls_booked?: number | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          fiduciary?: boolean | null
          firm_address?: string | null
          firm_aum?: string | null
          firm_bio?: string | null
          firm_logo_url?: string | null
          firm_name?: string | null
          firm_sec_crd?: string | null
          first_session_is_free?: boolean | null
          headshot_url?: string | null
          id?: string
          link_to_advisor_sec?: string | null
          link_to_firm_sec?: string | null
          minimum?: string | null
          name?: string
          personal_bio?: string | null
          phone_number?: string | null
          position?: string | null
          premium?: boolean | null
          primary_education?: string | null
          rating?: number | null
          scheduling_link?: string | null
          secondary_education?: string | null
          slug?: string
          state_hq?: string | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
          website_url?: string | null
          years_of_experience?: number | null
          youtube_video_id?: string | null
        }
        Relationships: []
      }
      investment_firm_clients: {
        Row: {
          client_type: string
          created_at: string | null
          firm_id: string
          id: string
        }
        Insert: {
          client_type: string
          created_at?: string | null
          firm_id: string
          id?: string
        }
        Update: {
          client_type?: string
          created_at?: string | null
          firm_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_firm_clients_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "investment_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_firm_features: {
        Row: {
          created_at: string | null
          feature: string
          firm_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          feature: string
          firm_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          feature?: string
          firm_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_firm_features_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "investment_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_firm_leadership: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          firm_id: string
          id: string
          name: string
          position: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          firm_id: string
          id?: string
          name: string
          position?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          firm_id?: string
          id?: string
          name?: string
          position?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_firm_leadership_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "investment_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_firm_regulatory_info: {
        Row: {
          created_at: string | null
          firm_id: string
          id: string
          registration: string
        }
        Insert: {
          created_at?: string | null
          firm_id: string
          id?: string
          registration: string
        }
        Update: {
          created_at?: string | null
          firm_id?: string
          id?: string
          registration?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_firm_regulatory_info_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "investment_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_firms: {
        Row: {
          address: string | null
          app_store_link: string | null
          asset_class: Database["public"]["Enums"]["Asset Class"] | null
          aum: string | null
          created_at: string | null
          description: string | null
          established: string | null
          fees: string | null
          firm_link: string | null
          headquarters: string | null
          how_company_makes_money: string | null
          how_you_make_money: string | null
          id: string
          investment_risks: string | null
          large_image_url: string | null
          liquidity: string | null
          logo_url: string | null
          long_description: string | null
          minimum_investment: number | null
          name: string
          payout: Database["public"]["Enums"]["payout_frequency"] | null
          play_store_link: string | null
          rating: number | null
          review_count: number | null
          slug: string
          small_image_url: string | null
          target_return: string | null
          updated_at: string | null
          verified: boolean | null
          video_url: string | null
          website: string | null
          withdrawal_type: Database["public"]["Enums"]["withdrawal_type"] | null
        }
        Insert: {
          address?: string | null
          app_store_link?: string | null
          asset_class?: Database["public"]["Enums"]["Asset Class"] | null
          aum?: string | null
          created_at?: string | null
          description?: string | null
          established?: string | null
          fees?: string | null
          firm_link?: string | null
          headquarters?: string | null
          how_company_makes_money?: string | null
          how_you_make_money?: string | null
          id?: string
          investment_risks?: string | null
          large_image_url?: string | null
          liquidity?: string | null
          logo_url?: string | null
          long_description?: string | null
          minimum_investment?: number | null
          name: string
          payout?: Database["public"]["Enums"]["payout_frequency"] | null
          play_store_link?: string | null
          rating?: number | null
          review_count?: number | null
          slug: string
          small_image_url?: string | null
          target_return?: string | null
          updated_at?: string | null
          verified?: boolean | null
          video_url?: string | null
          website?: string | null
          withdrawal_type?:
            | Database["public"]["Enums"]["withdrawal_type"]
            | null
        }
        Update: {
          address?: string | null
          app_store_link?: string | null
          asset_class?: Database["public"]["Enums"]["Asset Class"] | null
          aum?: string | null
          created_at?: string | null
          description?: string | null
          established?: string | null
          fees?: string | null
          firm_link?: string | null
          headquarters?: string | null
          how_company_makes_money?: string | null
          how_you_make_money?: string | null
          id?: string
          investment_risks?: string | null
          large_image_url?: string | null
          liquidity?: string | null
          logo_url?: string | null
          long_description?: string | null
          minimum_investment?: number | null
          name?: string
          payout?: Database["public"]["Enums"]["payout_frequency"] | null
          play_store_link?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string
          small_image_url?: string | null
          target_return?: string | null
          updated_at?: string | null
          verified?: boolean | null
          video_url?: string | null
          website?: string | null
          withdrawal_type?:
            | Database["public"]["Enums"]["withdrawal_type"]
            | null
        }
        Relationships: []
      }
      money_making_methods: {
        Row: {
          created_at: string | null
          description: string | null
          firm_id: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          firm_id: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          firm_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "money_making_methods_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "investment_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string
          id: string
          is_admin: boolean | null
          last_name: string
          phone_number: string | null
          professional_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id: string
          is_admin?: boolean | null
          last_name: string
          phone_number?: string | null
          professional_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          is_admin?: boolean | null
          last_name?: string
          phone_number?: string | null
          professional_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      similar_firms: {
        Row: {
          created_at: string | null
          firm_id: string
          id: string
          similar_firm_id: string
        }
        Insert: {
          created_at?: string | null
          firm_id: string
          id?: string
          similar_firm_id: string
        }
        Update: {
          created_at?: string | null
          firm_id?: string
          id?: string
          similar_firm_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "similar_firms_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "investment_firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "similar_firms_similar_firm_id_fkey"
            columns: ["similar_firm_id"]
            isOneToOne: false
            referencedRelation: "investment_firms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_category_to_post: {
        Args: { post_id: string; category: string }
        Returns: undefined
      }
      get_blog_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          slug: string
        }[]
      }
      get_post_categories: {
        Args: { post_id: string }
        Returns: {
          category_name: string
        }[]
      }
      remove_all_post_categories: {
        Args: { post_id: string }
        Returns: undefined
      }
      remove_category_from_post: {
        Args: { post_id: string; category: string }
        Returns: undefined
      }
    }
    Enums: {
      accounting_service_type:
        | "Advisory Services"
        | "Bookkeeping"
        | "Business Formation"
        | "Forensic Accounting"
        | "Fractional CFO Services"
        | "International Tax Services"
        | "Mergers and Acquisitions"
        | "Payroll Services"
        | "Sales Tax"
        | "Tax Preparation"
      "Asset Class":
        | "Art"
        | "Asset Management"
        | "Collectibles"
        | "Commodities"
        | "Cryptocurrency"
        | "Loans"
        | "Real Estate"
        | "Robo-Advisor"
        | "Savings"
        | "Startups"
        | "Trading"
      blog_category:
        | "Banking"
        | "Business"
        | "Loans"
        | "Investing"
        | "Insurance"
        | "Interview"
        | "Finance"
        | "Taxes"
        | "Real Estate"
        | "Retirement"
        | "Reviews"
      client_specialty_type:
        | "High Net Worth Individuals"
        | "Real Estate Investors"
        | "VC Backed"
        | "Ultra High Net Worth Individuals"
        | "Digital Nomads"
        | "Equity Compensation (RSUs, Stock Options)"
        | "QSBS Holders"
        | "HENRY (High Earners Not Rich Yet)"
        | "K1 Partnership Income"
        | "International/Expats"
        | "E-commerce Businesses"
        | "Crypto Investors"
        | "Solopreneurs"
        | "SMB Owner"
      clientele_type:
        | "Individuals"
        | "High Net Worth Individuals"
        | "Business Owners"
        | "Retirees"
        | "Families"
        | "Young Professionals"
        | "Medical Professionals"
        | "Tech Professionals"
      compensation_type:
        | "Fee-Only"
        | "Fee-Based"
        | "Commission"
        | "Hourly"
        | "Flat Fee"
        | "Assets Under Management"
      investor_type:
        | "Individual Investors"
        | "High Net Worth Individuals"
        | "Financial Advisors"
        | "Institutional Investors"
        | "Retirement Plan Sponsors"
        | "Endowments and Foundations"
        | "Corporations"
      payout_frequency:
        | "Monthly"
        | "Quarterly"
        | "Semi-Annually"
        | "Annually"
        | "Asset Sold"
      profession_type:
        | "Financial Advisor"
        | "CFP"
        | "CFA"
        | "Wealth Manager"
        | "Financial Planner"
        | "Investment Advisor"
        | "Retirement Planner"
      return_type:
        | "Dividends"
        | "Dividends & Value"
        | "Interest"
        | "Royalties"
        | "Value"
      service_offered:
        | "Financial Planning"
        | "Retirement Planning"
        | "Investment Management"
        | "Estate Planning"
        | "Tax Planning"
        | "Insurance Planning"
        | "Education Planning"
        | "Business Planning"
      States:
        | "Alabama"
        | "Alaska"
        | "Arizona"
        | "Arkansas"
        | "California"
        | "Colorado"
        | "Connecticut"
        | "Delaware"
        | "District of Columbia"
        | "Florida"
        | "Georgia"
        | "Hawaii"
        | "Idaho"
        | "Illinois"
        | "Indiana"
        | "Iowa"
        | "Kansas"
        | "Kentucky"
        | "Louisiana"
        | "Maine"
        | "Maryland"
        | "Massachusetts"
        | "Michigan"
        | "Minnesota"
        | "Mississippi"
        | "Missouri"
        | "Montana"
        | "Nebraska"
        | "Nevada"
        | "New Hampshire"
        | "New Jersey"
        | "New Mexico"
        | "New York"
        | "North Carolina"
        | "North Dakota"
        | "Ohio"
        | "Oklahoma"
        | "Oregon"
        | "Pennsylvania"
        | "Rhode Island"
        | "South Carolina"
        | "South Dakota"
        | "Tennessee"
        | "Texas"
        | "Utah"
        | "Vermont"
        | "Virginia"
        | "Washington"
        | "West Virginia"
        | "Wisconsin"
        | "Wyoming"
      withdrawal_type: "Anytime" | "Limited" | "Locked Period" | "Scheduled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      accounting_service_type: [
        "Advisory Services",
        "Bookkeeping",
        "Business Formation",
        "Forensic Accounting",
        "Fractional CFO Services",
        "International Tax Services",
        "Mergers and Acquisitions",
        "Payroll Services",
        "Sales Tax",
        "Tax Preparation",
      ],
      "Asset Class": [
        "Art",
        "Asset Management",
        "Collectibles",
        "Commodities",
        "Cryptocurrency",
        "Loans",
        "Real Estate",
        "Robo-Advisor",
        "Savings",
        "Startups",
        "Trading",
      ],
      blog_category: [
        "Banking",
        "Business",
        "Loans",
        "Investing",
        "Insurance",
        "Interview",
        "Finance",
        "Taxes",
        "Real Estate",
        "Retirement",
        "Reviews",
      ],
      client_specialty_type: [
        "High Net Worth Individuals",
        "Real Estate Investors",
        "VC Backed",
        "Ultra High Net Worth Individuals",
        "Digital Nomads",
        "Equity Compensation (RSUs, Stock Options)",
        "QSBS Holders",
        "HENRY (High Earners Not Rich Yet)",
        "K1 Partnership Income",
        "International/Expats",
        "E-commerce Businesses",
        "Crypto Investors",
        "Solopreneurs",
        "SMB Owner",
      ],
      clientele_type: [
        "Individuals",
        "High Net Worth Individuals",
        "Business Owners",
        "Retirees",
        "Families",
        "Young Professionals",
        "Medical Professionals",
        "Tech Professionals",
      ],
      compensation_type: [
        "Fee-Only",
        "Fee-Based",
        "Commission",
        "Hourly",
        "Flat Fee",
        "Assets Under Management",
      ],
      investor_type: [
        "Individual Investors",
        "High Net Worth Individuals",
        "Financial Advisors",
        "Institutional Investors",
        "Retirement Plan Sponsors",
        "Endowments and Foundations",
        "Corporations",
      ],
      payout_frequency: [
        "Monthly",
        "Quarterly",
        "Semi-Annually",
        "Annually",
        "Asset Sold",
      ],
      profession_type: [
        "Financial Advisor",
        "CFP",
        "CFA",
        "Wealth Manager",
        "Financial Planner",
        "Investment Advisor",
        "Retirement Planner",
      ],
      return_type: [
        "Dividends",
        "Dividends & Value",
        "Interest",
        "Royalties",
        "Value",
      ],
      service_offered: [
        "Financial Planning",
        "Retirement Planning",
        "Investment Management",
        "Estate Planning",
        "Tax Planning",
        "Insurance Planning",
        "Education Planning",
        "Business Planning",
      ],
      States: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
      withdrawal_type: ["Anytime", "Limited", "Locked Period", "Scheduled"],
    },
  },
} as const
