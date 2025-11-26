export enum MealType {
  Breakfast = 'Breakfast',
  Brunch = 'Brunch',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Supper = 'Supper'
}

export enum CultureStyle {
  American = 'American',
  European = 'European',
  Indian = 'Indian'
}

export enum TableZone {
  Center = 'center',
  Left1 = 'left_1',
  Left2 = 'left_2',
  Left3 = 'left_3',
  Right1 = 'right_1',
  Right2 = 'right_2',
  Right3 = 'right_3',
  TopLeft = 'top_left',
  TopRight = 'top_right',
  TopCenter = 'top_center',
  CenterTop = 'center_top'
}

export interface TableItem {
  id: string;
  name: string;
  type: 'plate' | 'cutlery' | 'glass' | 'napkin' | 'accessory' | 'bowl';
  zone: TableZone;
  description: string;
  icon?: string; // Icon name representation
}

export interface TableSettingConfig {
  title: string;
  description: string;
  items: TableItem[];
  tips: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: number;
}
