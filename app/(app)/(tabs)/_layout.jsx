// import React from 'react';
// import { Tabs } from 'expo-router';
// import { useAuth } from '../../../hooks/useAuth';
// import { useRole } from '../../../hooks/useRole';
// import { 
//   Home, 
//   Scan, 
//   ShoppingCart, 
//   CreditCard, 
//   Package, 
//   User,
//   BarChart3,
// } from 'lucide-react-native';
// import { Colors } from '../../../constants/theme';
// import { Roles } from '../../../constants/roles';
// import StoreSelector from '../../../components/ui/StoreSelector';

// export default function TabsLayout() {
//   const { user, currentStore } = useAuth();
//   const { 
//     isSuperAdmin, 
//     isAdmin, 
//     isSalesRole, 
//     isFinanceRole, 
//     isWarehouseRole,
//     role,
//     can 
//   } = useRole();

//   const getTabs = () => {
//     // Base tabs that everyone can see
//     const tabs = [
//       { 
//         name: 'index', 
//         title: 'Home', 
//         icon: Home, 
//         href: '/(app)/(tabs)/index',
//         show: true,
//       },
//       { 
//         name: 'scan', 
//         title: 'Scan', 
//         icon: Scan, 
//         href: '/(app)/(tabs)/scan',
//         show: true,
//       },
//     ];

//     tabs.push({
//       name: 'sales',
//       title: 'Sales',
//       icon: ShoppingCart,
//       href: '/(app)/(tabs)/sales',
//       show: isSalesRole || isAdmin || isSuperAdmin,
//     });

//     tabs.push({
//       name: 'finance',
//       title: 'Finance',
//       icon: CreditCard,
//       href: '/(app)/(tabs)/finance',
//       show: isFinanceRole || isAdmin || isSuperAdmin,
//     });

//     tabs.push({
//       name: 'warehouse',
//       title: 'Warehouse',
//       icon: Package,
//       href: '/(app)/(tabs)/warehouse',
//       show: isWarehouseRole || isAdmin || isSuperAdmin,
//     });

//     tabs.push({
//       name: 'reports',
//       title: 'Reports',
//       icon: BarChart3,
//       href: '/(app)/(tabs)/reports',
//       show: isAdmin || isSuperAdmin || 
//             [Roles.SALES_MANAGER, Roles.FINANCE_MANAGER, Roles.WAREHOUSE_MANAGER].includes(role),
//     });

//     tabs.push({
//       name: 'profile',
//       title: 'Profile',
//       icon: User,
//       href: '/(app)/(tabs)/profile',
//       show: true,
//     });

//     return tabs;
//   };

//   const tabs = getTabs();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarStyle: {
//           backgroundColor: Colors.white,
//           borderTopColor: Colors.gray200,
//           height: 70,
//           paddingBottom: 10,
//           paddingTop: 8,
//         },
//         tabBarActiveTintColor: Colors.primary,
//         tabBarInactiveTintColor: Colors.gray400,
//         headerShown: true,
//         headerTitle: () => <StoreSelector />,
//         headerStyle: {
//           backgroundColor: Colors.white,
//         },
//         headerTitleAlign: 'center',
//         tabBarShowLabel: true,
//         tabBarLabelStyle: {
//           fontSize: 10,
//           fontWeight: '500',
//         },
//       }}
//     >
//       {tabs.map((tab) => (
//         <Tabs.Screen
//           key={tab.name}
//           name={tab.name}
//           options={{
//             title: tab.title,
//             tabBarIcon: ({ color, size }) => (
//               <tab.icon color={color} size={size} />
//             ),
//             href: tab.show ? tab.href : null,
//           }}
//         />
//       ))}
      
//       <Tabs.Screen
//         name="admin"
//         options={{
//           href: null,
//         }}
//       />
//     </Tabs>
//   );
// }























import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';
import { Home, Scan, ShoppingCart, CreditCard, Package, User, BarChart3 } from 'lucide-react-native';
import { Colors } from '../../../constants/theme';
import StoreSelector from '../../../components/ui/StoreSelector';

export default function TabsLayout() {
  const { currentStore } = useAuth();
  const { isSuperAdmin, isAdmin, isSalesRole, isFinanceRole, isWarehouseRole, role } = useRole();

  const tabs = [
    { name: 'index', title: 'Home', icon: Home, show: true },
    { name: 'scan', title: 'Scan', icon: Scan, show: true },
    { name: 'sales', title: 'Sales', icon: ShoppingCart, show: isSalesRole || isAdmin || isSuperAdmin },
    { name: 'finance', title: 'Finance', icon: CreditCard, show: isFinanceRole || isAdmin || isSuperAdmin },
    { name: 'warehouse', title: 'Warehouse', icon: Package, show: isWarehouseRole || isAdmin || isSuperAdmin },
    { name: 'reports', title: 'Reports', icon: BarChart3, show: isAdmin || isSuperAdmin },
    { name: 'profile', title: 'Profile', icon: User, show: true },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray200,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        headerShown: true,
        headerTitle: () => <StoreSelector />,
        headerStyle: { backgroundColor: Colors.white },
        headerTitleAlign: 'center',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => <tab.icon color={color} size={size} />,
            href: tab.show ? `/(app)/(tabs)/${tab.name}` : null,
          }}
        />
      ))}
    </Tabs>
  );
}