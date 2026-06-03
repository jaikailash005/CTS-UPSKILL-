import java.io.FileWriter;

public class FileWriting {
    public static void main(String[] args) throws Exception {

        FileWriter fw = new FileWriter("output.txt");

        fw.write("Hello File");

        fw.close();

        System.out.println("Data Written");
    }
}