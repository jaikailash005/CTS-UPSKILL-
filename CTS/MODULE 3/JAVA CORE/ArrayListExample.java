import java.util.ArrayList;

public class ArrayListExample {
    public static void main(String[] args) {

        ArrayList<String> students = new ArrayList<>();

        students.add("John");
        students.add("David");
        students.add("Mary");

        for(String s : students) {
            System.out.println(s);
        }
    }
}