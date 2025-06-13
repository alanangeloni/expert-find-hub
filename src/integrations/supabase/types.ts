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
          advisor_services:
            | Database["public"]["Enums"]["Advisor Services"][]
            | null
          approved_at: string | null
          approved_by: string | null
          city: string | null
          client_type: Database["public"]["Enums"]["clientele_type"][] | null
          compensation:
            | Database["public"]["Enums"]["compensation_type"][]
            | null
          created_at: string | null
          disclaimer: string | null
          email: string | null
          fiduciary: boolean | null
          firm_address: string | null
          firm_aum: string | null
          firm_bio: string | null
          firm_logo_url: string | null
          firm_name: string | null
          firm_sec_crd: string | null
          headshot_url: string | null
          id: string
          licenses: Database["public"]["Enums"]["advisors_licenses"][] | null
          link_to_advisor_sec: string | null
          link_to_firm_sec: string | null
          linked_firm: string | null
          minimum: string | null
          name: string
          personal_bio: string | null
          phone_number: string | null
          position: string | null
          primary_education: string | null
          professional_designations:
            | Database["public"]["Enums"]["professional_designations_for_advisors"][]
            | null
          rejection_reason: string | null
          slug: string
          state_hq: Database["public"]["Enums"]["States"] | null
          states_registered_in: Database["public"]["Enums"]["States"][] | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
          website_url: string | null
          years_of_experience: number | null
          youtube_video_id: string | null
        }
        Insert: {
          advisor_sec_crd?: string | null
          advisor_services?:
            | Database["public"]["Enums"]["Advisor Services"][]
            | null
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          client_type?: Database["public"]["Enums"]["clientele_type"][] | null
          compensation?:
            | Database["public"]["Enums"]["compensation_type"][]
            | null
          created_at?: string | null
          disclaimer?: string | null
          email?: string | null
          fiduciary?: boolean | null
          firm_address?: string | null
          firm_aum?: string | null
          firm_bio?: string | null
          firm_logo_url?: string | null
          firm_name?: string | null
          firm_sec_crd?: string | null
          headshot_url?: string | null
          id?: string
          licenses?: Database["public"]["Enums"]["advisors_licenses"][] | null
          link_to_advisor_sec?: string | null
          link_to_firm_sec?: string | null
          linked_firm?: string | null
          minimum?: string | null
          name: string
          personal_bio?: string | null
          phone_number?: string | null
          position?: string | null
          primary_education?: string | null
          professional_designations?:
            | Database["public"]["Enums"]["professional_designations_for_advisors"][]
            | null
          rejection_reason?: string | null
          slug: string
          state_hq?: Database["public"]["Enums"]["States"] | null
          states_registered_in?: Database["public"]["Enums"]["States"][] | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website_url?: string | null
          years_of_experience?: number | null
          youtube_video_id?: string | null
        }
        Update: {
          advisor_sec_crd?: string | null
          advisor_services?:
            | Database["public"]["Enums"]["Advisor Services"][]
            | null
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          client_type?: Database["public"]["Enums"]["clientele_type"][] | null
          compensation?:
            | Database["public"]["Enums"]["compensation_type"][]
            | null
          created_at?: string | null
          disclaimer?: string | null
          email?: string | null
          fiduciary?: boolean | null
          firm_address?: string | null
          firm_aum?: string | null
          firm_bio?: string | null
          firm_logo_url?: string | null
          firm_name?: string | null
          firm_sec_crd?: string | null
          headshot_url?: string | null
          id?: string
          licenses?: Database["public"]["Enums"]["advisors_licenses"][] | null
          link_to_advisor_sec?: string | null
          link_to_firm_sec?: string | null
          linked_firm?: string | null
          minimum?: string | null
          name?: string
          personal_bio?: string | null
          phone_number?: string | null
          position?: string | null
          primary_education?: string | null
          professional_designations?:
            | Database["public"]["Enums"]["professional_designations_for_advisors"][]
            | null
          rejection_reason?: string | null
          slug?: string
          state_hq?: Database["public"]["Enums"]["States"] | null
          states_registered_in?: Database["public"]["Enums"]["States"][] | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website_url?: string | null
          years_of_experience?: number | null
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_financial_advisors_linked_firm"
            columns: ["linked_firm"]
            isOneToOne: false
            referencedRelation: "investment_firms"
            referencedColumns: ["id"]
          },
        ]
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
          full_service_firm: boolean | null
          headquarters: string | null
          how_company_makes_money: string | null
          how_you_make_money: string | null
          id: string
          investment_risks: string | null
          large_image_url: string | null
          linked_advisors: string[] | null
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
          full_service_firm?: boolean | null
          headquarters?: string | null
          how_company_makes_money?: string | null
          how_you_make_money?: string | null
          id?: string
          investment_risks?: string | null
          large_image_url?: string | null
          linked_advisors?: string[] | null
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
          full_service_firm?: boolean | null
          headquarters?: string | null
          how_company_makes_money?: string | null
          how_you_make_money?: string | null
          id?: string
          investment_risks?: string | null
          large_image_url?: string | null
          linked_advisors?: string[] | null
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
      meeting_requests: {
        Row: {
          advisor_id: string
          created_at: string
          email: string
          first_name: string
          id: string
          interested_in_discussing: string[] | null
          last_name: string
          message: string | null
          phone_number: string | null
          preferred_contact_method: string | null
          updated_at: string
        }
        Insert: {
          advisor_id: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          interested_in_discussing?: string[] | null
          last_name: string
          message?: string | null
          phone_number?: string | null
          preferred_contact_method?: string | null
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          interested_in_discussing?: string[] | null
          last_name?: string
          message?: string | null
          phone_number?: string | null
          preferred_contact_method?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_requests_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "financial_advisors"
            referencedColumns: ["id"]
          },
        ]
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
      newsletter_signups: {
        Row: {
          created_at: string
          Email: string | null
          id: number
          Name: string | null
        }
        Insert: {
          created_at?: string
          Email?: string | null
          id?: number
          Name?: string | null
        }
        Update: {
          created_at?: string
          Email?: string | null
          id?: number
          Name?: string | null
        }
        Relationships: []
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
      "Advisor Services":
        | "Alternative Investments"
        | "Budgeting"
        | "Business Succession Planning"
        | "Cash Flow Analysis"
        | "Cryptocurrency & NFTs"
        | "Debt Management"
        | "Divorce Planning"
        | "Education Planning"
        | "Elder Care"
        | "Employee/Employer Benefits"
        | "Environment, Social, and Governance"
        | "Estate/Trust Planning"
        | "Financial Planning"
        | "Health Care"
        | "Inheritance"
        | "Insurance Planning"
        | "Investment Management"
        | "Life Transitions"
        | "Long-term Care"
        | "Philanthropy Planning"
        | "Portfolio Construction"
        | "Retirement Income Management"
        | "Retirement Planning"
        | "Small Business Planning"
        | "Socially Responsible Investing"
        | "Social Security Planning"
        | "Sports and Entertainment"
        | "Succession Planning"
        | "Tax Planning"
        | "Wealth Management"
      advisors_licenses:
        | "Annuities"
        | "Health/Disability Insurance"
        | "Home & Auto"
        | "Insurance"
        | "Life/Accident/Health"
        | "Life & Health"
        | "Life & Disability"
        | "Life Insurance"
        | "Long Term Care"
        | "Series 3"
        | "Series 6"
        | "Series 7"
        | "Series 24"
        | "Series 26"
        | "Series 31"
        | "Series 63"
        | "Series 65"
        | "Series 66"
        | "Series 79"
        | "Series 99"
        | "SIE"
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
      professional_designations_for_advisors:
        | "Accredited Estate Planner (AEP)"
        | "Accredited Investment Fiduciary (AIF)"
        | "Accredited Portfolio Manager Advisor (APMA)"
        | "Certified Divorce Financial Analyst (CDFA)"
        | "Certified Exit Planning Advisor (CEPA)"
        | "Certified Financial Planner (CFP)"
        | "Certified Kingdom Advisor (CKA)"
        | "Certified Public Accountant (CPA)"
        | "Certified Specialist in Planned Giving (CSPG)"
        | "Certified Value Growth Advisor (CVGA)"
        | "Chartered Financial Consultant (ChFC)"
        | "Chartered Financial Analyst (CFA)"
        | "Chartered Special Needs Consultant (ChSNC)"
        | "Chartered Retirement Planning Counselor™ (CRPC®)"
        | "Enrolled Agent (EA)"
        | "Life Underwriting Training Council Fellow (LUTCF)"
        | "Registered Financial Consultant (RFC)"
        | "Registered Investment Advisor (RIA)"
        | "Retirement Management Advisor (RMA®)"
        | "Retirement Income Certified Professional (RICP)"
      return_type:
        | "Dividends"
        | "Dividends & Value"
        | "Interest"
        | "Royalties"
        | "Value"
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
      "Advisor Services": [
        "Alternative Investments",
        "Budgeting",
        "Business Succession Planning",
        "Cash Flow Analysis",
        "Cryptocurrency & NFTs",
        "Debt Management",
        "Divorce Planning",
        "Education Planning",
        "Elder Care",
        "Employee/Employer Benefits",
        "Environment, Social, and Governance",
        "Estate/Trust Planning",
        "Financial Planning",
        "Health Care",
        "Inheritance",
        "Insurance Planning",
        "Investment Management",
        "Life Transitions",
        "Long-term Care",
        "Philanthropy Planning",
        "Portfolio Construction",
        "Retirement Income Management",
        "Retirement Planning",
        "Small Business Planning",
        "Socially Responsible Investing",
        "Social Security Planning",
        "Sports and Entertainment",
        "Succession Planning",
        "Tax Planning",
        "Wealth Management",
      ],
      advisors_licenses: [
        "Annuities",
        "Health/Disability Insurance",
        "Home & Auto",
        "Insurance",
        "Life/Accident/Health",
        "Life & Health",
        "Life & Disability",
        "Life Insurance",
        "Long Term Care",
        "Series 3",
        "Series 6",
        "Series 7",
        "Series 24",
        "Series 26",
        "Series 31",
        "Series 63",
        "Series 65",
        "Series 66",
        "Series 79",
        "Series 99",
        "SIE",
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
      professional_designations_for_advisors: [
        "Accredited Estate Planner (AEP)",
        "Accredited Investment Fiduciary (AIF)",
        "Accredited Portfolio Manager Advisor (APMA)",
        "Certified Divorce Financial Analyst (CDFA)",
        "Certified Exit Planning Advisor (CEPA)",
        "Certified Financial Planner (CFP)",
        "Certified Kingdom Advisor (CKA)",
        "Certified Public Accountant (CPA)",
        "Certified Specialist in Planned Giving (CSPG)",
        "Certified Value Growth Advisor (CVGA)",
        "Chartered Financial Consultant (ChFC)",
        "Chartered Financial Analyst (CFA)",
        "Chartered Special Needs Consultant (ChSNC)",
        "Chartered Retirement Planning Counselor™ (CRPC®)",
        "Enrolled Agent (EA)",
        "Life Underwriting Training Council Fellow (LUTCF)",
        "Registered Financial Consultant (RFC)",
        "Registered Investment Advisor (RIA)",
        "Retirement Management Advisor (RMA®)",
        "Retirement Income Certified Professional (RICP)",
      ],
      return_type: [
        "Dividends",
        "Dividends & Value",
        "Interest",
        "Royalties",
        "Value",
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
