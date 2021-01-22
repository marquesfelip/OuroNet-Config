from pathlib import Path
import json
import xml.etree.ElementTree as ET

class getConnections:
    """Get the connections of "connectionStrings.config" from OuroNet file."""

    def __init__(self):
        self.connStrFile = ''

        with open (Path(__file__).parent.__str__() + '\\helpers\\settings.json') as settingsJson:
            settings = json.load(settingsJson)
            selectedDirectory = settings['selectedDirectory']

        validate = False

        filePaths = [selectedDirectory + '\\OuroNetCadastro\\connectionStrings.config',
        selectedDirectory + '\\OuroNetMovimento\\connectionStrings.config',
        selectedDirectory + '\\OuroNetFinanceiro\\connectionStrings.config']

        i = 0
        while validate == False:
            try:
                self.connStrFile = ET.parse(filePaths[i])
                validate = True
                self.readXML()

            except Exception as identifier:
                if identifier.errno == 2:
                    print('Arquivo nao encontrado em ' + filePaths[i])
                    i += 1
                    validate = False

    def readXML(self):
        """Read the XML File of OuroNet that contains the connections strings."""
        allConnectionsPath = ''

        try:
            allConnectionsPath = Path(__file__).parent.__str__() + '\\helpers\\allConnections.json'
        except Exception as identifier:
            print(identifier)
            return

        try:
            tree = self.connStrFile
            root = tree.getroot()
            jsonDir = Path(Path(__file__).parent.__str__() + '\\helpers')
            allConnections = {}

            # If 'json' doesn't exist, it will be created
            if not jsonDir.exists():
                jsonDir.mkdir(parents=True, exist_ok=True)

            i = 0
            for connectionString in root.iter('add'):
                currentConnection = {}
                lista = connectionString.attrib['connectionString'].split(';')

                # Insert in currentConnection dict the Keys 'Data Source', 'Initial Catalog' and the values for each key
                currentConnection[lista[0].split('=')[0]] = lista[0].split('=')[1]
                currentConnection[lista[1].split('=')[0]] = lista[1].split('=')[1]

                allConnections[i] = currentConnection

                i += 1

            self.createJsonFileConnections(allConnectionsPath, allConnections)
            return

        except Exception as identifier:
            with open(allConnectionsPath, 'w') as fp:
                json.dump({}, fp)

            print(identifier)
            return

    def createJsonFileConnections(self, allConnectionsPath, allConnections):
        """Generates the json file with connections got in "readXML" method."""
        with open(allConnectionsPath, 'w') as fp:
            json.dump(allConnections, fp)

def main():
    getConnections()

main()
