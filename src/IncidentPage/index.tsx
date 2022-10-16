import { View, StyleSheet, ScrollView, Text } from "react-native";

const PostPage = ({ route }: { route: any }) => {
  return (
    <View style={styles.containerStyle}>
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <Text style={{ fontSize: 18 }}>{route.params.incident.id}</Text>
        <Text style={{ fontSize: 18 }}>{route.params.incident.title}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  scrollViewStyle: {
    flexGrow: 1,
  },
});

export default PostPage;
