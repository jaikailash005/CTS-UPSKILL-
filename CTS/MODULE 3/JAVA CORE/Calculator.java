import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter First Number: ");
        double a = sc.nextDouble();

        System.out.print("Enter Second Number: ");
        double b = sc.nextDouble();

        System.out.print("Enter Operator (+,-,*,/): ");
        char op = sc.next().charAt(0);

        switch(op) {
            case '+':
                System.out.println("Result = " + (a+b));
                break;
            case '-':
                System.out.println("Result = " + (a-b));
                break;
            case '*':
                System.out.println("Result = " + (a*b));
                break;
            case '/':
                System.out.println("Result = " + (a/b));
                break;
            default:
                System.out.println("Invalid Operator");
        }
    }
}