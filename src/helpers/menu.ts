import {
  MENU_ITEMS,
  HORIZONTAL_MENU_ITEMS,
  TWO_COl_MENU_ITEMS,
  MenuItemTypes,
} from "../constants/menu";

const getMenuItems = (leadCount: string, ScheduleCount: string, everyLeadsCount: string) => {

  return MENU_ITEMS.map((item) => {
    if (item.key === "apps-today-leads") {
      return {
        ...item,
        badge: { variant: "success", text: leadCount },
      };
    }

    if (item.key === "apps-scheduled-leads") {
      return {
        ...item,
        badge: { variant: "success", text: ScheduleCount },
      };
    }
    
    if (item.key === "apps-all-leads") {
      return {
        ...item,
        badge: { variant: "success", text: everyLeadsCount  },
      };
    }
    
    return item;
  });
};

const getHorizontalMenuItems = () => {
  // NOTE - You can fetch from server and return here as well
  return HORIZONTAL_MENU_ITEMS;
};

const getTwoColumnMenuItems = () => {
  // NOTE - You can fetch from server and return here as well
  return TWO_COl_MENU_ITEMS;
};

const findAllParent = (
  menuItems: MenuItemTypes[],
  menuItem: MenuItemTypes
): string[] => {
  let parents: string[] = [];
  const parent = findMenuItem(menuItems, menuItem["parentKey"]);

  if (parent) {
    parents.push(parent["key"]);
    if (parent["parentKey"])
      parents = [...parents, ...findAllParent(menuItems, parent)];
  }

  return parents;
};

const findMenuItem = (
  menuItems: MenuItemTypes[] | undefined,
  menuItemKey: MenuItemTypes["key"] | undefined
): MenuItemTypes | null => {
  if (menuItems && menuItemKey) {
    for (var i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) {
        return menuItems[i];
      }
      var found = findMenuItem(menuItems[i].children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};

export {
  getMenuItems,
  getHorizontalMenuItems,
  getTwoColumnMenuItems,
  findAllParent,
  findMenuItem,
};
