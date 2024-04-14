import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import moment from "moment-timezone";

const popularTimezones = [
  {
    label: "America/Adak",
    city: "Adak",
    country: "Estados Unidos",
    gmt: "-10:00",
  },
  {
    label: "Pacific/Honolulu",
    city: "Honolulu",
    country: "Estados Unidos",
    gmt: "-10:00",
  },
  {
    label: "America/Anchorage",
    city: "Anchorage",
    country: "Estados Unidos",
    gmt: "-09:00",
  },
  {
    label: "America/Juneau",
    city: "Juneau",
    country: "Estados Unidos",
    gmt: "-09:00",
  },
  {
    label: "America/Metlakatla",
    city: "Metlakatla",
    country: "Estados Unidos",
    gmt: "-08:00",
  },
  {
    label: "America/Nome",
    city: "Nome",
    country: "Estados Unidos",
    gmt: "-09:00",
  },
  {
    label: "America/Yakutat",
    city: "Yakutat",
    country: "Estados Unidos",
    gmt: "-09:00",
  },
  {
    label: "America/Los_Angeles",
    city: "Los Angeles",
    country: "Estados Unidos",
    gmt: "-08:00",
  },
  {
    label: "America/Denver",
    city: "Denver",
    country: "Estados Unidos",
    gmt: "-07:00",
  },
  {
    label: "America/Phoenix",
    city: "Phoenix",
    country: "Estados Unidos",
    gmt: "-07:00",
  },
  {
    label: "America/Chicago",
    city: "Chicago",
    country: "Estados Unidos",
    gmt: "-06:00",
  },
  {
    label: "America/New_York",
    city: "Nova Iorque",
    country: "Estados Unidos",
    gmt: "-05:00",
  },
  { label: "America/Bahia", city: "Bahia", country: "Brasil", gmt: "-03:00" },
  { label: "America/Recife", city: "Recife", country: "Brasil", gmt: "-03:00" },
  {
    label: "America/Fortaleza",
    city: "Fortaleza",
    country: "Brasil",
    gmt: "-03:00",
  },
  {
    label: "America/Araguaina",
    city: "Araguaína",
    country: "Brasil",
    gmt: "-03:00",
  },
  { label: "America/Maceio", city: "Maceió", country: "Brasil", gmt: "-03:00" },
  { label: "America/Belem", city: "Belém", country: "Brasil", gmt: "-03:00" },
  {
    label: "America/Sao_Paulo",
    city: "São Paulo",
    country: "Brasil",
    gmt: "-03:00",
  },
  {
    label: "America/Campo_Grande",
    city: "Campo Grande",
    country: "Brasil",
    gmt: "-04:00",
  },
  { label: "America/Cuiaba", city: "Cuiabá", country: "Brasil", gmt: "-04:00" },
  { label: "America/Manaus", city: "Manaus", country: "Brasil", gmt: "-04:00" },
  {
    label: "America/Porto_Velho",
    city: "Porto Velho",
    country: "Brasil",
    gmt: "-04:00",
  },
  {
    label: "America/Boa_Vista",
    city: "Boa Vista",
    country: "Brasil",
    gmt: "-04:00",
  },
  {
    label: "America/Eirunepe",
    city: "Eirunepé",
    country: "Brasil",
    gmt: "-05:00",
  },
  {
    label: "America/Rio_Branco",
    city: "Rio Branco",
    country: "Brasil",
    gmt: "-05:00",
  },
];

const ListItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.item}>
    <Text style={styles.title}>
      {item.city}, {item.country} (GMT {item.gmt})
    </Text>
  </TouchableOpacity>
);

const App = () => {
  const [selectedTimeZone, setSelectedTimeZone] = useState(""); // Estado para armazenar o fuso horário selecionado
  const [currentDateTime, setCurrentDateTime] = useState(moment()); // Estado para armazenar a data e hora atual

  // Função para lidar com a mudança no fuso horário selecionado
  const handleTimeZoneChange = (timeZone) => {
    setSelectedTimeZone(timeZone);
    setCurrentDateTime(moment().tz(timeZone)); // Atualiza a data e hora com o fuso horário selecionado
  };

  return (
    <View style={styles.container}>
      <Text>Data e hora atuais no fuso horário selecionado:</Text>
      <Text>{currentDateTime.format("YYYY-MM-DD HH:mm:ss")}</Text>

      <FlatList
        data={popularTimezones}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            onPress={() => handleTimeZoneChange(item.label)}
          />
        )}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  list: {
    marginTop: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 16,
  },
});

export default App;
