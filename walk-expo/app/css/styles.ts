import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0b1220',
  },
  title: {
    color: '#e6edf3',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#111a2b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e2a44',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#c8d1dc',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0b1220',
    color: '#e6edf3',
    borderWidth: 1,
    borderColor: '#223453',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    fontSize: 14,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#3a86ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  kv: {
    color: '#d2dae3',
    fontSize: 14,
    marginTop: 4,
  },
});
