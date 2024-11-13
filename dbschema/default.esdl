module default {
  # 用户类型
  type User {
    required property email -> str {
      constraint exclusive;  # 确保邮箱唯一
    };
    required property name -> str;
    required property clerk_id -> str {
      constraint exclusive;
    };
    property avatar_url -> str;
    property created_at -> datetime {
      default := datetime_current();
    };
    
    # 会员相关
    property membership_type -> str {
      default := 'free';  # free, pro, enterprise
    };
    property membership_expires -> datetime;
    
    # 使用统计
    property daily_extractions -> int64 {
      default := 0;
    };
    property last_extraction_date -> datetime;
  }

  # 提取历史记录
  type ExtractionHistory {
    required link user -> User;
    required property url -> str;
    required property title -> str;
    required property content -> str;
    required property created_at -> datetime {
      default := datetime_current();
    };
  }
} 