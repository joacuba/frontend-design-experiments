import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Paragraph,
  useTheme,
  Divider,
  Chip
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/auth';

export const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await login(credentials);
    if (!result.success && result.error) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const demoCredentials = [
    { email: 'admin@inventorypro.com', role: 'Admin' },
    { email: 'manager@inventorypro.com', role: 'Manager' },
    { email: 'demo@inventorypro.com', role: 'Employee' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="package-variant" 
            size={64} 
            color={theme.colors.primary} 
          />
          <Title style={[styles.title, { color: theme.colors.onBackground }]}>
            InventoryPro
          </Title>
          <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
            Mobile Inventory Management
          </Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Email Address"
              value={credentials.email}
              onChangeText={(text) => setCredentials({ ...credentials, email: text })}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
            />

            <TextInput
              label="Password"
              value={credentials.password}
              onChangeText={(text) => setCredentials({ ...credentials, password: text })}
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
            >
              Sign In
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.demoCard}>
          <Card.Content>
            <Title style={styles.demoTitle}>Demo Credentials</Title>
            <Divider style={styles.divider} />
            {demoCredentials.map((demo, index) => (
              <View key={index} style={styles.demoItem}>
                <Text style={styles.demoEmail}>{demo.email}</Text>
                <Chip mode="outlined" compact>
                  {demo.role}
                </Chip>
              </View>
            ))}
            <View style={styles.passwordInfo}>
              <Text style={[styles.passwordText, { color: theme.colors.onSurfaceVariant }]}>
                Password for all accounts: <Text style={styles.passwordValue}>password123</Text>
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  demoCard: {
    opacity: 0.9,
  },
  demoTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  demoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  demoEmail: {
    fontSize: 14,
    flex: 1,
  },
  passwordInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  passwordText: {
    fontSize: 12,
    textAlign: 'center',
  },
  passwordValue: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});