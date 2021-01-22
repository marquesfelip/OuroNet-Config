from pathlib import Path
import json
import xml.etree.ElementTree as ET

class setConnections:

    def __init__(self):

        with open (Path(__file__).parent.__str__() + '\\helpers\\settings.json') as settingsJson:
            settings = json.load(settingsJson)
            selectedDirectory = settings['selectedDirectory']

        self.setConnectionStringsFile(selectedDirectory)
        self.setConfigurationServerFile(selectedDirectory)

    def setConnectionStringsFile(self, selectedDirectory):
        connStringFileName = 'connectionStrings.config'

        filePaths = [selectedDirectory + '\\OuroNetCadastro\\connectionStrings.config',
        selectedDirectory + '\\OuroNetMovimento\\connectionStrings.config',
        selectedDirectory + '\\OuroNetFinanceiro\\connectionStrings.config']

        try:
            connectionStringsConfig = ET.parse(filePaths[0])
        except Exception as identifier:
            print('Erro na leitura do arquivo ' + connStringFileName + ' na pasta OuroNetCadastro')
            print(identifier)
            return

        rootConnStr = connectionStringsConfig.getroot()

        connStr = rootConnStr.find('connectionStrings')
        connStr.clear()
        connStr.tail = '\n'
        connStr.text = '\n\n  '

        with open(Path(__file__).parent.__str__() + '\\helpers\\newConnections.json') as data:
            connDict = json.load(data)

        for key in connDict:
            addTag = ET.SubElement(connStr, 'add')

            addTag.attrib['name'] = 'OuroWeb_Custom_' + connDict[key]['Initial Catalog']

            addTag.attrib['connectionString'] = 'Data Source=' + connDict[key]['Data Source'] + ';Initial Catalog=' + connDict[key]['Initial Catalog'] + ';' + 'User ID=ouro;Password=nc7895al63;Application Name=OuroNet'

            addTag.attrib['providerName'] = 'System.Data.SqlClient'
            addTag.tail = '\n\n  '

        for path in filePaths:
            try:
                connectionStringsConfig.write(path, encoding='utf-8', xml_declaration=True, method='xml')
            except Exception as identifier:
                print('Erro na escrita do arquivo ' + connStringFileName + ' na pasta ' + path)
                print(identifier)

    def setConfigurationServerFile(self, selectedDirectory):
        confServerFileName = 'custom.configuration.server.config'

        filePaths = [selectedDirectory + '\\OuroNetCadastro\\custom.configuration.server.config',
        selectedDirectory + '\\OuroNetMovimento\\custom.configuration.server.config',
        selectedDirectory + '\\OuroNetFinanceiro\\custom.configuration.server.config']

        try:
            configurationServer = ET.parse(filePaths[0])
        except Exception as identifier:
            print('Erro na leitura do arquivo ' + confServerFileName + ' na pasta OuroNetCadastro')
            print(identifier)
            return

        rootConfSrv = configurationServer.getroot()

        databases = rootConfSrv.find('products').find('product').find('enterprises').find('enterprise').find('databases')
        databases.clear()
        databases.tail = '\n        '
        databases.text = '\n\n            '

        with open(Path(__file__).parent.__str__() + '\\helpers\\newConnections.json') as data:
            connDict = json.load(data)

        for key in connDict:
            databaseTag = ET.SubElement(databases, 'database')

            databaseTag.attrib['name'] = connDict[key]['Initial Catalog']
            databaseTag.attrib['key'] = 'OuroWeb_Custom_' + connDict[key]['Initial Catalog']
            databaseTag.tail = '\n\n            '
            databaseTag.text = '\n              '

            auxiliarydatabasesTag = ET.SubElement(databaseTag, 'auxiliarydatabases')
            auxiliarydatabasesTag.tail = '\n            '
            auxiliarydatabasesTag.text = '\n                '

            auxdatabaseTag = ET.SubElement(auxiliarydatabasesTag, 'auxdatabase')
            auxdatabaseTag.attrib['name'] = 'OuroReports'
            auxdatabaseTag.attrib['key'] = 'OuroReports_Custom_' + connDict[key]['Initial Catalog']
            auxdatabaseTag.tail = '\n              '

        for path in filePaths:
            try:
                configurationServer.write(path, encoding='utf-8', xml_declaration=True, method='xml')
            except Exception as identifier:
                print('Erro na escrita do arquivo ' + confServerFileName + ' na pasta ' + path)
                print(identifier)

def main():
    setConnections()

main()
