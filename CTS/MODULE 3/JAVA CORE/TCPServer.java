import java.io.*;
import java.net.*;

public class TCPServer {

    public static void main(String[] args)
            throws Exception {

        ServerSocket server =
                new ServerSocket(5000);

        Socket socket = server.accept();

        BufferedReader br =
                new BufferedReader(
                        new InputStreamReader(
                                socket.getInputStream()));

        System.out.println(br.readLine());

        server.close();
    }
}