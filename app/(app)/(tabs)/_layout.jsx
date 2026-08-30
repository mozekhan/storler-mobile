// import React from 'react';
// import { Tabs } from 'expo-router';
// import { useAuth } from '../../../hooks/useAuth';
// import { useRole } from '../../../hooks/useRole';
// import { Home, Scan, ShoppingCart, CreditCard, Package, User, BarChart3 } from 'lucide-react-native';
// import { Colors } from '../../../constants/theme';
// import StoreSelector from '../../../components/ui/StoreSelector';

// export default function TabsLayout() {
//   const { currentStore } = useAuth();
//   const { isSuperAdmin, isAdmin, isSalesRole, isFinanceRole, isWarehouseRole, role } = useRole();

//   const tabs = [
//     { name: 'index', title: 'Home', icon: Home, show: true },
//     { name: 'scan', title: 'Scan', icon: Scan, show: true },
//     { name: 'sales', title: 'Sales', icon: ShoppingCart, show: isSalesRole || isAdmin || isSuperAdmin },
//     { name: 'finance', title: 'Finance', icon: CreditCard, show: isFinanceRole || isAdmin || isSuperAdmin },
//     { name: 'warehouse', title: 'Warehouse', icon: Package, show: isWarehouseRole || isAdmin || isSuperAdmin },
//     { name: 'profile', title: 'Profile', icon: User, show: true },
//   ];

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarStyle: {
//           backgroundColor: Colors.gray50,
//           borderTopColor: Colors.gray50,
//           height: 80,
//           paddingBottom: 10,
//           paddingTop: 8,
//         },
//         tabBarActiveTintColor: Colors.primary,
//         tabBarInactiveTintColor: Colors.secondary,
//         tabBarActiveBackgroundColor: Colors.cardBlue,
//         headerShown: true,
//         headerTitle: () => <StoreSelector />,
//         headerStyle: { backgroundColor: Colors.primary },
//         headerTitleAlign: 'center',
//         tabBarShowLabel: true,
//         tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
//       }}
      
//     >
//       {tabs.map((tab) => (
//         <Tabs.Screen
//           key={tab.name}
//           name={tab.name}
//           options={{
//             title: tab.title,
//             tabBarIcon: ({ color, size }) => <tab.icon color={color} size='34' />,
//             // href: tab.show ? `/(app)/(tabs)/${tab.name}` : null,
//           }}
//         />
//       ))}
//     </Tabs>
//   );
// }
























import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';
import {
  Home,
  Scan,
  ShoppingCart,
  CreditCard,
  Package,
  User,
} from 'lucide-react-native';
import { Colors } from '../../../constants/theme';
import StoreSelector from '../../../components/ui/StoreSelector';

export default function TabsLayout() {
  const { currentStore } = useAuth();

  const {
    isSuperAdmin,
    isAdmin,
    isSalesRole,
    isFinanceRole,
    isWarehouseRole,
    role,
  } = useRole();

  console.log('Current RBAC role:', {
    role,
    isSuperAdmin,
    isAdmin,
    isSalesRole,
    isFinanceRole,
    isWarehouseRole,
  });

  const canAccessSales =
    isSalesRole || isAdmin || isSuperAdmin;

  const canAccessFinance =
    isFinanceRole || isAdmin || isSuperAdmin;

  const canAccessWarehouse =
    isWarehouseRole || isAdmin || isSuperAdmin;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.gray50,
          borderTopColor: Colors.gray50,
          height: 80,
          paddingBottom: 10,
          paddingTop: 8,
        },

        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarActiveBackgroundColor: Colors.cardBlue,

        headerShown: true,
        headerTitle: () => <StoreSelector />,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTitleAlign: 'center',

        tabBarShowLabel: true,

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >

      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',

          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),

          href: '/',
        }}
      />

      {/* SCAN */}
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',

          tabBarIcon: ({ color, size }) => (
            <Scan color={color} size={size} />
          ),

          href: '/scan',
        }}
      />

      {/* SALES */}
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Sales',

          tabBarIcon: ({ color, size }) => (
            <ShoppingCart color={color} size={size} />
          ),

          href: canAccessSales ? '/sales' : null,
        }}
      />

      {/* FINANCE */}
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',

          tabBarIcon: ({ color, size }) => (
            <CreditCard color={color} size={size} />
          ),

          href: canAccessFinance ? '/finance' : null,
        }}
      />

      {/* WAREHOUSE */}
      <Tabs.Screen
        name="warehouse"
        options={{
          title: 'Warehouse',

          tabBarIcon: ({ color, size }) => (
            <Package color={color} size={size} />
          ),

          href: canAccessWarehouse ? '/warehouse' : null,
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',

          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),

          href: '/profile',
        }}
      />

    </Tabs>
  );
}